const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const moment = require('moment')
const mariadb = require('mariadb')

function parseLinks ($, $msg) {
  return $msg.find('.body .text a').map(function () {
    const $a = $(this)
    let href = $a.attr('href')
    if (href.search('http') === -1) {
      href = 'https://' + href
    }
    let host = null
    try {
      host = new URL(href).host
    } catch (e) {}
    return {
      href: $a.attr('href'),
      text: $a.text().trim(),
      host
    }
  }).get()
}

function parseCodes ($, $msg) {
  return $msg.find('.body code').map(function () {
    return ($(this).html() || '').trim()
  }).get()
}

function parseMessages (data) {
  const $ = cheerio.load(data, {
    decodeEntities: false
  })

  const res = $('.message:not(.service)').map(function () {
    const dateStr = $(this).find('.body .date').attr('title')
    let date = false
    if (dateStr) {
      date = moment(dateStr, 'DD.MM.YYYY HH.mm.ss').toDate()
    }
    const $el = $(this)
    return {
      id: parseInt($el.attr('id').replace('message', ''), 10),
      text: ($el.find('.body .text').html() || '').trim(),
      user: $el.find('.body:not(.forwarded) > .from_name').text().trim(),
      isReply: Boolean($el.find('.body .reply_to').length),
      isForward: Boolean($el.find('.body .forwarded').length),
      date,
      isJoined: $el.hasClass('joined'),
      links: parseLinks($, $el),
      codes: parseCodes($, $el),
      stickersCnt: $el.find('.body .sticker').length,
      photosCnt: $el.find('.body .photo').length,
      videoCnt: $el.find('.body .video').length
    }
  }).get()

  res.forEach((msg, i) => {
    if (msg.isJoined) {
      const prevMsg = res[i - 1]
      if (!prevMsg) {
        throw new Error('Должно быть предыдущее сообщение')
      }
      msg.user = prevMsg.user
      msg.prevMsgId = prevMsg.id
    }
  })

  return res
}

async function getUserId (connection, userName) {
  let userId = null
  const users = await connection.query(`
    select id
    from users
    where name = ?
  `, [userName])
  if (users.length > 1) {
    throw new Error(`Пользователей с именем ${userName} больше одного`)
  } else if (users.length === 0) {
    const insertRes = await connection.query(`
      insert into users (name)
      values (?)
    `, [userName])
    if (insertRes.insertId === 0) {
      throw new Error('id не должен быть равен 0')
    }
    userId = insertRes.insertId
  } else {
    userId = users[0].id
  }

  return userId
}

async function insertMsg (connection, msg, userId) {
  await connection.query(`
    insert into messages (
      id,
      txt,
      user_id,
      is_reply,
      is_forward,
      dt,
      is_joined,
      stickers_cnt,
      photos_cnt,
      video_cnt,
      prev_msg_id
    )
    values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    msg.id,
    msg.text,
    userId,
    msg.isReply,
    msg.isForward,
    msg.date,
    msg.isJoined,
    msg.stickersCnt,
    msg.photosCnt,
    msg.videoCnt,
    msg.prevMsgId || null
  ])

  return msg.id
}

async function getHostId (connection, hostName) {
  let hostId = null
  const hosts = await connection.query(`
    select id
    from hosts
    where name = ?
  `, [hostName])
  if (hosts.length > 1) {
    throw new Error(`Хостов с именем ${hostName} больше одного`)
  } else if (hosts.length === 0) {
    const insertRes = await connection.query(`
      insert into hosts (name)
      values (?)
    `, [hostName])
    if (insertRes.insertId === 0) {
      throw new Error('id не должен быть равен 0')
    }
    hostId = insertRes.insertId
  } else {
    hostId = hosts[0].id
  }

  return hostId
}

async function insertLink (connection, link, msgId) {
  let hostId = null
  if (link.host) {
    hostId = await getHostId(connection, link.host)
  }
  await connection.query(`
    insert into links(
      href,
      host_id,
      txt,
      message_id
    )
    values(?, ?, ?, ?)
  `, [link.href, hostId, link.text, msgId]
  )
}

async function insertCode (connection, code, msgId) {
  await connection.query(`
    insert into codes(
      code,
      message_id
    )
    values(?, ?)
    `, [code, msgId]
  )
}

async function loadMessagesToDB (messages, progressCb) {
  const connection = await mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'orel_codes'
  })

  try {
    let i = 0
    for (const msg of messages) {
      const userId = await getUserId(connection, msg.user)
      const msgId = await insertMsg(connection, msg, userId)

      for (const l of msg.links) {
        await insertLink(connection, l, msgId)
      }

      for (const c of msg.codes) {
        await insertCode(connection, c, msgId)
      }

      i++
      progressCb(`${i}/${messages.length}`)
    }
  } catch (e) {
    throw e
  } finally {
    await connection.end()
  }
}

(async () => {
  const dir = './chat-data'
  const messagesFileNames = fs.readdirSync(dir).filter((n) => {
    return /\.html$/.test(n)
  })

  let i = 1
  for (const fileName of messagesFileNames) {
    const data = fs.readFileSync(path.resolve(dir, fileName)).toString()
    const messages = parseMessages(data)

    await loadMessagesToDB(messages, (progressMsg) => {
      console.log(`file: ${i}/${messagesFileNames.length}; msg: ${progressMsg}`)
    })
    i++
  }
})()
