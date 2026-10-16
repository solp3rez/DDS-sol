/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_520427368")

  // update collection data
  unmarshal({
    "name": "personas_mayores"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_520427368")

  // update collection data
  unmarshal({
    "name": "people"
  }, collection)

  return app.save(collection)
})
