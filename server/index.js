const Hapi = require('@hapi/hapi')
const laabr = require('laabr')
const blipp = require('blipp')
const Verror = require('verror')

const mariadb = require('mariadb')
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  database: 'orel_codes'
})

function handlerDB (handler) {
  return async function handlerWithConnectionWrapper (req, h) {
    const conn = await pool.getConnection()

    let res
    try {
      res = await handler(conn, req, h)
    } catch (e) {
      throw Verror(e, 'Вызов обработчика')
    } finally {
      if (conn) {
        await conn.release()
      }
    }

    return res
  }
}

async function getUsersHandler (conn, req, h) {
  const users = await conn.query(`
    select u.id
         , u.name
         , count(l.href) cnt_links
         , count(c.code) cnt_codes
         , sum(char_length(m.txt)) cnt_chars
    from users u
    join messages m on m.user_id = u.id
      and m.is_forward = 0
    left join links l on l.message_id = m.id
      and l.host is not null
      and l.host not in ('t.me', 't.co')
    left join codes c on c.message_id = m.id
    where u.name != 'Combot'
    group by u.id
        , u.name
    order by u.name
  `)

  return { users }
}

(async () => {
  const server = Hapi.server({
    port: 8080,
    host: 'localhost'
  })

  server.route({ method: 'GET', path: '/api/users', handler: handlerDB(getUsersHandler) })

  await server.register({
    plugin: laabr,
    options: {
      colored: true
    }
  })

  await server.register({
    plugin: blipp,
    options: {
    }
  })

  await server.start()
})()
