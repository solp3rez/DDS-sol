/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_752665753")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text171200496",
    "max": 200,
    "min": 0,
    "name": "texto",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // update field
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
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
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
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select643686883",
    "maxSelect": 0,
    "name": "estado",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "pendiente"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_752665753")

  // update field
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

  // update field
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

  // update field
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

  // update field
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
})
