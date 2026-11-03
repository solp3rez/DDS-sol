/// <reference path="../pb_data/types.d.ts" />
// Parlantes de Cerca (las Raspberry). Cada equipo tiene un identificador único, por ejemplo CERCA-001.
//
// Quién hace qué:
// - El equipo (administrador) crea la ficha en el panel con el identificador y deja "familiar" vacío.
//   Nadie más puede crear ni borrar fichas (createRule y deleteRule bloqueadas con null).
// - El familiar vincula el parlante desde la app escribiendo ese identificador: la app cambia
//   "familiar" de vacío a su propia cuenta. También puede desvincularlo (volver a dejarlo vacío).
// - La Raspberry se configura con el MISMO identificador. El identificador nombra al equipo,
//   no reemplaza sus credenciales ni los permisos MQTT.
migrate((app) => {
  const usuarios = app.findCollectionByNameOrId('usuarios')

  const collection = new Collection({
    type: 'base',
    name: 'parlantes',
    // Ve su propio parlante. Un parlante libre solo se encuentra si se pide EXACTAMENTE por su
    // identificador (?identificador=CERCA-001): así nadie puede listar todos los equipos sin dueño.
    listRule: '@request.auth.id != "" && (familiar = @request.auth.id || (familiar = "" && @request.query.identificador = identificador))',
    viewRule: '@request.auth.id != "" && (familiar = @request.auth.id || (familiar = "" && @request.query.identificador = identificador))',
    createRule: null,
    // Solo se puede cambiar "familiar", y solo de dos maneras:
    // vincular (libre -> yo) o desvincular (mío -> vacío). Nunca tocar el identificador.
    updateRule: '@request.auth.id != "" && @request.body.identificador:isset = false && ((familiar = "" && @request.body.familiar = @request.auth.id) || (familiar = @request.auth.id && @request.body.familiar = ""))',
    deleteRule: null,
    fields: [
      { type: 'text', name: 'identificador', required: true, pattern: '^CERCA-[0-9]{3,6}$' },
      { type: 'relation', name: 'familiar', collectionId: usuarios.id, maxSelect: 1, cascadeDelete: false },
      { type: 'autodate', name: 'created', onCreate: true },
      { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
    ],
    indexes: [
      'CREATE UNIQUE INDEX `idx_parlantes_identificador` ON `parlantes` (`identificador`)',
    ],
  })

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId('parlantes')
  return app.delete(collection)
})
