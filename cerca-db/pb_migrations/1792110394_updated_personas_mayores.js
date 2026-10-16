/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_520427368")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id != \"\" &&\nfamiliar = @request.auth.id &&\n@request.body.familiar:isset = true &&\n@request.body.familiar = \"\" &&\n@request.body.name:changed = false &&\n@request.body.relation:changed = false &&\n@request.body.avatar:changed = false"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_520427368")

  // update collection data
  unmarshal({
    "updateRule": null
  }, collection)

  return app.save(collection)
})
