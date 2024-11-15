module.exports = {
  development: {
    client: 'mysql',  
    connection: {  
     user: 'u542279038_nagarkirtan',  
     password: 'Tdssaini@123',
     host: 'srv1675.hstgr.io',  
     database: 'u542279038_nagarkirtan'  
    },
    pool: { min: 1, max: 20 }
  },

  production: {
    client: 'mysql',  
    connection: {  
    user: 'u542279038_nagarkirtan',  
    password: 'Tdssaini@123',
    host: 'srv1675.hstgr.io',  
    database: 'u542279038_nagarkirtan'  
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
