# Parlantes (Raspberry): cómo se vincula y activa

Nota para quien configura la Raspberry y el puente MQTT. Todo lo de abajo está implementado en la base de PocketBase de `cerca-db/` (migraciones + `pb_hooks`).

## Identificador del equipo

- Cada parlante tiene un identificador único, por ejemplo `CERCA-001` (formato `CERCA-` + 3 a 6 números).
- La ficha se crea **una sola vez**, en el panel de PocketBase, colección `parlantes`: solo `identificador`.
- La Raspberry se configura con **el mismo identificador**. No hace falta crear otro registro.
- El identificador nombra al equipo. **No reemplaza** las credenciales ni los permisos MQTT.

## Cómo queda activo un parlante

1. El familiar guarda a la persona mayor en la app (nombre + dibujo).
2. Escribe el identificador en la app: `parlantes.familiar` pasa a ser su cuenta. Todavía `activo = false`.
3. Toca "Mandar código por correo": el servidor manda un código de 6 números al correo de su cuenta (vale 10 minutos, 5 intentos, 1 envío por minuto).
4. Escribe el código en la app: el servidor pone `activo = true` y completa `persona_mayor`.

Si el familiar desvincula el parlante, vuelve solo a `activo = false` y sin `persona_mayor`.

**Solo el servidor puede poner `activo = true`.** La app no puede saltearse el código (las reglas de la colección lo impiden).

## Qué campos mira el puente MQTT

Colección `parlantes`:

| Campo | Significado |
|---|---|
| `identificador` | `CERCA-001` |
| `familiar` | cuenta dueña (vacío = libre) |
| `activo` | `true` solo después de confirmar el código del correo |
| `persona_mayor` | persona que acompaña el equipo |

**Regla de oro:** solo enviar órdenes a un parlante con `activo = true`, y solo atender pedidos de ayuda de un parlante con `activo = true`.

## Temas MQTT

| Tema | Dirección | Estado |
|---|---|---|
| `cerca/CERCA-001/ordenes` | servidor → Raspberry (reproducir un mensaje) | acordado |
| `cerca/CERCA-001/ayuda` | Raspberry → servidor (pedido de ayuda) | **propuesta**, falta acordar |

## Lo que todavía NO existe

- **Nadie publica en MQTT todavía.** La app guarda los mensajes en PocketBase con `estado = "pendiente"` (colección `mensajes`) y ahí se quedan. Hace falta un puente que lea los pendientes de parlantes activos y los publique en `cerca/<identificador>/ordenes`.
- Los permisos MQTT (ACL de Mosquitto) por equipo, para que una Raspberry inactiva no pueda conectarse, son aparte y de quien administra el broker.
- Las alertas de ayuda reales (hoy las pantallas de alertas son de ejemplo).

## Requisitos de PocketBase en cada lugar donde corra

- Configurar el correo (SMTP) en Settings → Mail settings. Sin eso el código no sale.
- Copiar `pb_migrations/` **y `pb_hooks/`** junto al ejecutable. Se aplican al reiniciar.
