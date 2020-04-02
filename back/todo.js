const conn = require("./connection");

class Todo{
    async create(name){
     const todo = await conn('projects').insert({
          name: name,

      }).returning('*');
      return todo;
    }

    async list(){
        const todo = await conn('projects').select('*').orderBy('id');
         return todo;
}

    async delete(id){ 
        await conn('tasks').where({
            project_id: id,
        }).del();

         await conn('projects').where({
            id: id,
        }).del();  
    }

     async edit(id,newname){
         await conn('projects').where({
             id:id,
         }).update({
             name: newname,
         });
     }
}

module.exports = Todo;