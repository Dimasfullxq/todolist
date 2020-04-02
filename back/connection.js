let knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'drona.db.elephantsql.com',
      port : 5432,
      user : 'lkdyrzqy',
      password : 'Gv3Yxb1nk17GWT33cp2htlnRvCFTp-_M',
      database : 'lkdyrzqy'
    }
  });


  module.exports = knex;

 
  