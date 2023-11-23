module.exports = {
  development: {
    client: 'mysql',  
    connection: {  
     user: 'mebonixi_restapitestuser',  
     password: 'iaXCDIuWWMHJ',
     host: 'inpro11.fcomet.com',  
     database: 'mebonixi_jjjk_server'  
    },
    pool: { min: 1, max: 20 }
  },

  production: {
    client: 'mysql',  
    connection: {  
    user: 'mebonixi_restapitestuser',  
    password: 'iaXCDIuWWMHJ',
    host: 'inpro11.fcomet.com',  
    database: 'mebonixi_jjjk_server'  
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
