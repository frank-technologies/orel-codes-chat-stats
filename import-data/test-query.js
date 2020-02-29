const mariadb = require('mariadb');

;(async () => {
  const connection = await mariadb.createConnection({
    host:     'localhost',
    user:     'root',
    password: '',
    database: 'orel_codes',
  })

  const res = await connection.query('select * from messages limit 3')
  console.log(res)

  await connection.end()
})()