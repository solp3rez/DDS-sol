/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3237654691")

  // update collection data
  unmarshal({
    "name": "mensajes_programados"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3237654691")

  // update collection data
  unmarshal({
    "name": "scheduled_messages"
  }, collection)

  return app.save(collection)
})
