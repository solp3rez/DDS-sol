/// <reference path="../pb_data/types.d.ts" />
// Colecciones iniciales de Cerca: personas vinculadas y mensajes programados.
// Reglas abiertas ("") para desarrollo: la app todavía no tiene login.
// Antes de publicar, agregá autenticación y restringí las reglas.
migrate((app) => {
  const people = new Collection({
    type: 'base',
    name: 'people',
    listRule: '',
    viewRule: '',
    createRule: '',
    updateRule: '',
    deleteRule: '',
    fields: [
      { type: 'text', name: 'name', required: true },
      { type: 'text', name: 'relation' },
      { type: 'text', name: 'avatar' }, // 'rosa' | 'carlos' | 'ana'
      { type: 'autodate', name: 'created', onCreate: true },
      { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
    ],
  })
  app.save(people)

  const scheduled = new Collection({
    type: 'base',
    name: 'scheduled_messages',
    listRule: '',
    viewRule: '',
    createRule: '',
    updateRule: '',
    deleteRule: '',
    fields: [
      { type: 'text', name: 'recipientId' },
      { type: 'text', name: 'recipientName' },
      { type: 'text', name: 'recipientAvatar' },
      { type: 'select', name: 'mode', required: true, maxSelect: 1, values: ['text', 'voice'] },
      { type: 'text', name: 'message' },
      { type: 'text', name: 'date' }, // 'YYYY-MM-DD'
      { type: 'text', name: 'time' }, // 'HH:MM'
      { type: 'select', name: 'repeat', maxSelect: 1, values: ['once', 'daily', 'weekdays', 'weekly'] },
      { type: 'autodate', name: 'created', onCreate: true },
      { type: 'autodate', name: 'updated', onCreate: true, onUpdate: true },
    ],
  })
  app.save(scheduled)
}, (app) => {
  app.delete(app.findCollectionByNameOrId('scheduled_messages'))
  app.delete(app.findCollectionByNameOrId('people'))
})
