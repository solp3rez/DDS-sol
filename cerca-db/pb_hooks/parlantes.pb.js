/// <reference path="../pb_data/types.d.ts" />
// Activación de parlantes con un código enviado por correo.
//
// Importante de PocketBase: cada función de acá corre aislada, por eso las constantes
// se repiten adentro de cada una y no se comparten desde afuera.
//
// Rutas (todas exigen sesión iniciada en "usuarios"):
//   POST /api/cerca/parlante/enviar-codigo     -> manda un código de 6 números al correo del familiar
//   POST /api/cerca/parlante/confirmar-codigo  -> { codigo }; si es correcto, activa el parlante

// Si un parlante cambia de dueño (o se desvincula), vuelve a quedar inactivo y sin persona.
onRecordUpdate((e) => {
  const antes = e.record.original()
  if (antes.getString('familiar') !== e.record.getString('familiar')) {
    e.record.set('activo', false)
    e.record.set('persona_mayor', '')
  }
  e.next()
}, 'parlantes')

routerAdd('POST', '/api/cerca/parlante/enviar-codigo', (e) => {
  const VIDA_MS = 10 * 60 * 1000 // el código vale 10 minutos
  const ESPERA_MS = 60 * 1000    // no se puede pedir otro antes de 1 minuto

  const usuario = e.auth

  let parlante
  try {
    parlante = $app.findFirstRecordByFilter('parlantes', 'familiar = {:u}', { u: usuario.id })
  } catch (_) {
    throw new BadRequestError('Primero vinculá tu parlante con su identificador.')
  }
  if (parlante.getBool('activo')) throw new BadRequestError('Tu parlante ya está activado.')

  try {
    $app.findFirstRecordByFilter('personas_mayores', 'familiar = {:u}', { u: usuario.id })
  } catch (_) {
    throw new BadRequestError('Primero guardá los datos de la persona mayor.')
  }

  const ahora = Date.now()
  let registro = null
  try {
    registro = $app.findFirstRecordByFilter('codigos_parlante', 'parlante = {:p}', { p: parlante.id })
  } catch (_) {
    registro = null
  }
  if (registro && ahora - registro.getInt('enviado') < ESPERA_MS) {
    throw new TooManyRequestsError('Esperá un minuto antes de pedir otro código.')
  }

  const codigo = $security.randomStringWithAlphabet(6, '0123456789')
  if (!registro) registro = new Record($app.findCollectionByNameOrId('codigos_parlante'))
  registro.set('usuario', usuario.id)
  registro.set('parlante', parlante.id)
  registro.set('hash', $security.sha256(codigo + ':' + usuario.id + ':' + parlante.id))
  registro.set('vence', ahora + VIDA_MS)
  registro.set('enviado', ahora)
  registro.set('intentos', 0)
  $app.save(registro)

  const correo = usuario.email()
  const ajustes = $app.settings()
  const mensaje = new MailerMessage({
    from: { address: ajustes.meta.senderAddress, name: ajustes.meta.senderName },
    to: [{ address: correo }],
    subject: 'Tu código de Cerca: ' + codigo,
    html:
      '<p>Hola,</p>' +
      '<p>Tu código para activar el parlante <strong>' + parlante.getString('identificador') + '</strong> es:</p>' +
      '<p style="font-size:28px;letter-spacing:6px"><strong>' + codigo + '</strong></p>' +
      '<p>Vence en 10 minutos. Si no lo pediste vos, ignorá este mensaje.</p>',
  })
  try {
    $app.newMailClient().send(mensaje)
  } catch (err) {
    // Sin correo no hay forma de usar el código: lo borramos para poder pedir otro enseguida.
    $app.delete(registro)
    $app.logger().error('No se pudo enviar el código del parlante', 'error', String(err))
    throw new ApiError(500, 'No se pudo enviar el correo. Revisá la configuración de correo de PocketBase.', null)
  }

  const [nombre, dominio] = correo.split('@')
  return e.json(200, {
    enviado: true,
    venceEnSegundos: VIDA_MS / 1000,
    correo: nombre.slice(0, 1) + '***@' + dominio,
  })
}, $apis.requireAuth('usuarios'))

routerAdd('POST', '/api/cerca/parlante/confirmar-codigo', (e) => {
  const MAX_INTENTOS = 5

  const usuario = e.auth
  const datos = new DynamicModel({ codigo: '' })
  e.bindBody(datos)
  const codigo = String(datos.codigo || '').replace(/\s+/g, '')
  if (!/^[0-9]{6}$/.test(codigo)) throw new BadRequestError('Escribí los 6 números del código.')

  let parlante
  try {
    parlante = $app.findFirstRecordByFilter('parlantes', 'familiar = {:u}', { u: usuario.id })
  } catch (_) {
    throw new BadRequestError('Primero vinculá tu parlante con su identificador.')
  }
  if (parlante.getBool('activo')) {
    return e.json(200, { activo: true, identificador: parlante.getString('identificador') })
  }

  let registro
  try {
    registro = $app.findFirstRecordByFilter('codigos_parlante', 'parlante = {:p}', { p: parlante.id })
  } catch (_) {
    throw new BadRequestError('Pedí un código nuevo.')
  }
  if (registro.getString('usuario') !== usuario.id) throw new BadRequestError('Pedí un código nuevo.')

  if (Date.now() > registro.getInt('vence')) {
    $app.delete(registro)
    throw new BadRequestError('El código venció. Pedí uno nuevo.')
  }
  if (registro.getInt('intentos') >= MAX_INTENTOS) {
    $app.delete(registro)
    throw new BadRequestError('Hubo demasiados intentos. Pedí un código nuevo.')
  }

  const esperado = registro.getString('hash')
  const recibido = $security.sha256(codigo + ':' + usuario.id + ':' + parlante.id)
  if (!$security.equal(esperado, recibido)) {
    const intentos = registro.getInt('intentos') + 1
    if (intentos >= MAX_INTENTOS) {
      $app.delete(registro)
      throw new BadRequestError('Hubo demasiados intentos. Pedí un código nuevo.')
    }
    registro.set('intentos', intentos)
    $app.save(registro)
    throw new BadRequestError('El código no es correcto. Te quedan ' + (MAX_INTENTOS - intentos) + ' intentos.')
  }

  let persona
  try {
    persona = $app.findFirstRecordByFilter('personas_mayores', 'familiar = {:u}', { u: usuario.id })
  } catch (_) {
    throw new BadRequestError('Primero guardá los datos de la persona mayor.')
  }

  parlante.set('activo', true)
  parlante.set('persona_mayor', persona.id)
  $app.save(parlante)
  $app.delete(registro)

  return e.json(200, {
    activo: true,
    identificador: parlante.getString('identificador'),
    persona_mayor: persona.id,
  })
}, $apis.requireAuth('usuarios'))
