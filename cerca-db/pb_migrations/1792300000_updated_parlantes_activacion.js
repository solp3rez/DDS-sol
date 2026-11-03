/// <reference path="../pb_data/types.d.ts" />
// Activación del parlante con un código enviado por correo.
//
// - parlantes.activo: solo el servidor lo pone en true (cuando el código es correcto).
// - parlantes.persona_mayor: a quién acompaña el equipo. También lo completa solo el servidor.
// - codigos_parlante: guarda el código ENCRIPTADO con vencimiento. La app no puede leerla ni tocarla
//   (todas las reglas en null): solo la usan las rutas de pb_hooks/parlantes.pb.js.
migrate((app) => {
  const usuarios = app.findCollectionByNameOrId('usuarios')
  const personas = app.findCollectionByNameOrId('personas_mayores')
  const parlantes = app.findCollectionByNameOrId('parlantes')

  parlantes.fields.add(new Field({ type: 'bool', name: 'activo' }))
  parlantes.fields.add(new Field({
    type: 'relation', name: 'persona_mayor', collectionId: personas.id, maxSelect: 1, cascadeDelete: false,
  }))

  // Igual que antes (vincular / desvincular), pero ahora la app tampoco puede tocar
  // "activo" ni "persona_mayor": si pudiera, se saltearía el código del correo.
  parlantes.updateRule =
    '@request.auth.id != "" && @request.body.identificador:isset = false && ' +
    '@request.body.activo:isset = false && @request.body.persona_mayor:isset = false && ' +
    '((familiar = "" && @request.body.familiar = @request.auth.id) || ' +
    '(familiar = @request.auth.id && @request.body.familiar = ""))'
  app.save(parlantes)

  const codigos = new Collection({
    type: 'base',
    name: 'codigos_parlante',
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { type: 'relation', name: 'usuario', required: true, collectionId: usuarios.id, maxSelect: 1, cascadeDelete: true },
      { type: 'relation', name: 'parlante', required: true, collectionId: parlantes.id, maxSelect: 1, cascadeDelete: true },
      { type: 'text', name: 'hash', required: true, hidden: true },
      { type: 'number', name: 'vence' },    // milisegundos desde 1970
      { type: 'number', name: 'enviado' },  // milisegundos desde 1970
      { type: 'number', name: 'intentos' },
      { type: 'autodate', name: 'created', onCreate: true },
      { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
    ],
    // Un solo código vigente por parlante.
    indexes: ['CREATE UNIQUE INDEX `idx_codigos_parlante_parlante` ON `codigos_parlante` (`parlante`)'],
  })
  app.save(codigos)
}, (app) => {
  app.delete(app.findCollectionByNameOrId('codigos_parlante'))

  const parlantes = app.findCollectionByNameOrId('parlantes')
  parlantes.fields.removeByName('persona_mayor')
  parlantes.fields.removeByName('activo')
  parlantes.updateRule =
    '@request.auth.id != "" && @request.body.identificador:isset = false && ' +
    '((familiar = "" && @request.body.familiar = @request.auth.id) || ' +
    '(familiar = @request.auth.id && @request.body.familiar = ""))'
  app.save(parlantes)
})
