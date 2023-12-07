const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Password@123',
  database: 'fall',
})

connection.connect(function (err) {
  if(err)
    console.log(err);
  console.log('connected')
})
     

module.exports = connection;