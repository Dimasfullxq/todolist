const conn = require("./connection");

class Task{

    async create(name,projectId){
     const task = await conn('tasks').insert({
          name: name,
          status: false,
          priorStatus: false,
          project_id: projectId,

      }).returning('*');
      return task[0];
    }

 async list(projectId){
    const tasks = await conn('tasks').select('*').where({ 
        project_id: projectId,
    }).orderBy('status', 'asc').orderBy('id', 'asc');
     return tasks;    
}
  
    async delete(id){
        await conn('tasks').where({
            id: id,
        }).del();
}

   async edit(id,newname){
       await conn('tasks').where({
           id: id,
       }).update({
           name: newname,
       });
   }

    async finish(id){
        await conn('tasks').where({
            id: id,
        }).update({
            status: true,
            priorStatus: false,
        });
    }

    async unfinish(id){
        await conn('tasks').where({
           id: id,
        }).update({
            status: false,
        });
    }

    async prior(id){
        await conn('tasks').where({
            id: id,
        }).update({
            priorStatus: true,
        });
    }

    async unprior(id){
        await conn('tasks').where({
            id: id,
        }).update({
            priorStatus: false,
        });
    }
    
}

module.exports = Task;