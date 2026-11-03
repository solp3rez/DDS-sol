/// <reference path="../pb_data/types.d.ts" />
// El avatar del familiar solo debe verse con un token de archivo y la regla View de usuarios.
migrate((app) => {
  const collection = app.findCollectionByNameOrId('_pb_users_auth_')
  const avatar = collection.fields.getByName('avatar')
  if (!avatar) throw new Error('Falta el campo avatar de usuarios')
  avatar.hidden = false
  avatar.protected = true
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId('_pb_users_auth_')
  const avatar = collection.fields.getByName('avatar')
  if (!avatar) throw new Error('Falta el campo avatar de usuarios')
  avatar.hidden = true
  avatar.protected = false
  return app.save(collection)
})
