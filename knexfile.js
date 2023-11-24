module.exports = {
  development: {
    client: 'mysql',  
    connection: {  
     user: 'mebonixi_gurdwara_anandvihar',  
     password: 'Gurdwara@123',
     host: 'inpro11.fcomet.com',  
     database: 'mebonixi_gurdwara_anandvihar'  
    },
    pool: { min: 1, max: 20 }
  },

  production: {
    client: 'mysql',  
    connection: {  
    user: 'mebonixi_gurdwara_anandvihar',  
    password: 'Gurdwara@123',
    host: 'inpro11.fcomet.com',  
    database: 'mebonixi_gurdwara_anandvihar'  
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
