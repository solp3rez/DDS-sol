/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_752665753")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text171200496",
    "max": 0,
    "min": 0,
    "name": "texto",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "help": "",
    "hidden": false,
    "id": "relation2318715486",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "familiar",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_520427368",
    "help": "",
    "hidden": false,
    "id": "relation3449152005",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "persona_mayor",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select643686883",
    "maxSelect": 0,
    "name": "estado",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pendiente"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_752665753")

  // remove field
  collection.fields.removeById("text171200496")

  // remove field
  collection.fields.removeById("relation2318715486")

  // remove field
  collection.fields.removeById("relation3449152005")

  // remove field
  collection.fields.removeById("select643686883")

  return app.save(collection)
})
