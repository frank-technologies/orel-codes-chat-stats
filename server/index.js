const Hapi = require('@hapi/hapi')
const laabr = require('laabr')
const blipp = require('blipp')
const Verror = require('verror')
const Joi = require('@hapi/joi')
const Qs = require('qs')

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

const getUsers = {
  handler: handlerDB(async function getUsersHandler (conn, req, h) {
    const users = await conn.query(`
      select u.id
           , u.name
           , count(l.href) cnt_links
           , count(c.code) cnt_codes
           , sum(char_length(m.txt)) cnt_chars
      from users u
      join messages m on m.user_id = u.id
        and m.is_forward = 0
      left join (
        select l.id
           , l.href
           , l.message_id
          from links l
          join hosts h on h.id = l.host_id
          where h.name not in ('t.me', 't.co')
      ) l on l.message_id = m.id
      left join codes c on c.message_id = m.id
      where u.name != 'Combot'
      group by u.id
          , u.name
      order by u.name
    `)

    return { users }
  })
}

const getHosts = {
  validate: {
    query: Joi.object({
      user_ids: Joi.alternatives(
        Joi.array().items(Joi.number()),
        Joi.number()
      ).required(),
      top: Joi.number().integer().default(5)
    }),
    failAction: (req, h, err) => { throw err }
  },
  handler: handlerDB(async (conn, req, h) => {
    const query = req.query

    const hosts = await conn.query(`
      select *
      from (
          select m.user_id user
               , concat(m.user_id, '-', h.id) id
               , h.name
               , count(l.href) cnt_links
               , row_number() over (partition by m.user_id order by count(l.href) desc) place
        from messages m
        join links l on l.message_id = m.id
          join hosts h on h.id = l.host_id
        where m.user_id in ${conn.escape(query.user_ids)}
          and h.name not in ('t.me', 't.co')
        group by m.user_id
            , h.id
            , h.name
        order by cnt_links desc
      ) d
      where d.place <= ?
    `, [query.top])

    return { hosts }
  })
}

const getMessages = {
  validate: {
    query: Joi.object({
      user_ids: Joi.alternatives(
        Joi.array().items(Joi.number()),
        Joi.number()
      ).required(),
      top: Joi.number().integer().default(5)
    }),
    failAction: (req, h, err) => { throw err }
  },
  handler: handlerDB(async (conn, req, h) => {
    const query = req.query

    const messages = await conn.query(`
      select *
      from (
        select m.user_id user
             , m.id
             , m.txt
             , char_length(m.txt) txt_len
             , row_number() over (partition by m.user_id order by char_length(m.txt) desc) place  
        from messages m
        where m.user_id in ${conn.escape(query.user_ids)}
        group by m.user_id
               , m.id
               , m.txt
      ) d
      where d.place <= ?
    `, [query.top])

    return { messages }
  })
}

const getCodes = {
  validate: {
    query: Joi.object({
      user_ids: Joi.alternatives(
        Joi.array().items(Joi.number()),
        Joi.number()
      ).required(),
      top: Joi.number().integer().default(5)
    }),
    failAction: (req, h, err) => { throw err }
  },
  handler: handlerDB(async (conn, req, h) => {
    const query = req.query

    const codes = await conn.query(`
      select *
      from (
          select m.user_id user
               , c.id
               , c.code
               , char_length(c.code) code_len
               , row_number() over (partition by m.user_id order by char_length(c.code) desc) place 
          from messages m
            join codes c on c.message_id = m.id
          where m.user_id in ${conn.escape(query.user_ids)}
          group by m.user_id
              , c.id
              , c.code
      ) d
      where d.place <= ?
    `, [query.top])

    return { codes }
  })
};

(async () => {
  const server = Hapi.server({
    port: 8080,
    host: 'localhost',
    query: {
      parser: (query) => Qs.parse(query)
    }
  })

  server.route({ method: 'GET', path: '/api/users', options: getUsers })
  server.route({ method: 'GET', path: '/api/hosts', options: getHosts })
  server.route({ method: 'GET', path: '/api/messages', options: getMessages })
  server.route({ method: 'GET', path: '/api/codes', options: getCodes })

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
