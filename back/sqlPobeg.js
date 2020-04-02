const conn = require("./connection");

async function pobeg(){

    try{

        
        await conn.schema.dropTable('tasks');
        await conn.schema.dropTable('projects');
        


 await conn.schema.createTable('projects', function (table) {
    table.increments('id').primary();
    table.string('name');
    
  });
  

  await conn.schema.createTable('tasks', function (table) {
    table.increments('id').primary();
    table.string('name');
    table.boolean('status');
    table.boolean('priorStatus');
    table.integer('project_id').references('id').inTable('projects');

  });
  
}
catch(e){
    console.log(e);
}


}


pobeg().then(() => {
    process.exit();
} );


 

