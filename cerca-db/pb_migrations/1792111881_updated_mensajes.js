/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_752665753")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" &&\nfamiliar = @request.auth.id &&\npersona_mayor.familiar = @request.auth.id &&\nestado = \"pendiente\"",
    "viewRule": "@request.auth.id != \"\" && familiar = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_752665753")

  // update collection data
  unmarshal({
    "createRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
