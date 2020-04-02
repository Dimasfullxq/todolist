let addtodolist = document.getElementById('addnewpr');
let main = document.getElementById('main');
const url = 'https://blueberry-custard-32576.herokuapp.com';
jQuery.each( [ "put", "delete" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ) {
      if ( jQuery.isFunction( data ) ) {
        type = type || callback;
        callback = data;
        data = undefined;
      }
   
      return jQuery.ajax({
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback
      });
    };
  });

function initData() {

    $.get(`${url}`, function(responseText) {
        console.log(responseText);
        

        for(let i = 0;i<responseText.todolist.length;i++){
            let maincont = addnewproject(responseText.todolist[i].name,responseText.todolist[i].id);
            main.appendChild(maincont);
            bindproject(maincont);
        }
        let todos = main.querySelectorAll('.maincont');

        for(let i = 0;i<todos.length;i++){
            let taskmenu = todos[i].querySelector('.taskmenu');
            let finishedtasks = todos[i].querySelector('.finishedtasks');
            let priortasks = todos[i].querySelector('.priortasks');
            
            for(let j = 0;j<responseText.todolist[i].tasks.length;j++){
                if(!responseText.todolist[i].tasks[j].status){
                    if(!responseText.todolist[i].tasks[j].priorStatus){
                          let listitem = createnewelement(responseText.todolist[i].tasks[j].name,responseText.todolist[i].tasks[j].id);
                          taskmenu.appendChild(listitem);
                          bindtask(listitem);
                    }

                    if(responseText.todolist[i].tasks[j].priorStatus){
                        let prioritem = createnewelement(responseText.todolist[i].tasks[j].name,responseText.todolist[i].tasks[j].id)

                        prioritem.style.backgroundColor = "#62c7e3";
                        prioritem.querySelector('label').style.color = "black";
                        prioritem.style.borderBottomLeftRadius = "0px";
                        prioritem.style.borderBottomRightRadius = "0px";

                        priortasks.appendChild(prioritem);
                        bindtask(prioritem);

                        let delprior = prioritem.querySelector('.task_prior');
                        delprior.onclick = cancelprior;
                    }
                }
                else{

                let finishedli = document.createElement('li');
                finishedli.className = "task";
                finishedli.id = responseText.todolist[i].tasks[j].id;
                
                finishedli.innerHTML = `<div class = 'task_block_check'>
                <input class = 'task_checkbox' type='checkbox'></div>
                <label class = 'task_label'></label>
                <button class = 'task_delete'></button>`;
                
                finishedli.style.backgroundColor = "#c8dbcd";
                finishedli.querySelector('label').innerText = responseText.todolist[i].tasks[j].name;
                finishedli.querySelector('label').style.color = "green";
                finishedli.querySelector('.task_delete').style.width = "90px";
                finishedli.querySelector('.task_delete').onclick = taskdel;
                finishedli.querySelector('.task_checkbox').checked = true;
                finishedli.querySelector('.task_checkbox').onclick = unfinishtask;
                
                finishedtasks.appendChild(finishedli);

                }
            }
        }  
     });
  }

initData();

function createnewelement(task,id){

let listitem = document.createElement('li');
listitem.className = "task";
listitem.id = id;

let taskblockcheck = document.createElement('div');
taskblockcheck.className = "task_block_check";
taskblockcheck.innerHTML = "<input class = 'task_checkbox' type='checkbox'>";

let tasklabel = document.createElement('label');
tasklabel.className = "task_label";

let taskprior = document.createElement('button');
taskprior.className = "task_prior";

let taskedit = document.createElement('button');
taskedit.className = "task_edit";

let taskdelete = document.createElement('button');
taskdelete.className = "task_delete";

tasklabel.innerText = task;

listitem.appendChild(taskblockcheck);
listitem.appendChild(tasklabel);
listitem.appendChild(taskprior);
listitem.appendChild(taskedit);
listitem.appendChild(taskdelete);

return listitem;

}

function newtodo(){

    let projectname = prompt("Enter a name of your new project: ");
    if(projectname==""||projectname==null){
    projectname = prompt("Enter a name of your new project: ");
    }
    else{
    $.post(
        `${url}`,{
            text: projectname,
        }, function(responseText){
            console.log(responseText);

            let maincont = addnewproject(projectname,responseText[responseText.length-1].id);
            main.appendChild(maincont);
            bindproject(maincont);
            
        });
        
        console.log("Success! Created new todo!");
        
    }
}

function addnewtask() {

    let menu = this.parentNode;
    let input = menu.querySelector("input");
    let maincont = menu.parentNode;
    let taskmenu = maincont.querySelector(".taskmenu");
  
    if (input.value) {
      $.post(
        `${url}/todo/${maincont.id}/task`,
        {
          value: input.value,
        },
        function(responseText) {
          console.log(responseText);

          let listitem = createnewelement(input.value,responseText.data.id);
          taskmenu.appendChild(listitem);
          bindtask(listitem);
          input.value = "";
          
         
        }
      ).fail(function(xhr, status, error) {
        alert(JSON.parse(xhr.responseText).error);
      });  
     
    }
 }

function addnewproject(projectname,id){
    
    let maincont = document.createElement('div');
    maincont.className = "maincont";
    maincont.id = id;

    let head = document.createElement('div');
    head.className = "head";
    head.innerHTML = `<button class = 'project_calendar'></button>
    <label class="project_label"></label>
    <button class = 'project_edit' ></button>
    <button class = 'project_delete'></button>`;
    head.querySelector('label').innerText = projectname;

    let addtask = document.createElement('div');
    addtask.className = "addtask";
    addtask.innerHTML = `<span class = "addtask_plus">+</span>
    <input id="newtask" class = "addtask_input" type="text" placeholder="Start typing here to create a task...">
    <button class="addtask_button">Add Task</button>`;

    let priortasks = document.createElement('ul');
    priortasks.className = "priortasks";
    
    let taskmenu = document.createElement('ul');
    taskmenu.className = "taskmenu";

    let finishedtask = document.createElement('ul');
    finishedtask.className = "finishedtasks"; 

    maincont.appendChild(head);
    maincont.appendChild(addtask);
    maincont.appendChild(priortasks);
    maincont.appendChild(taskmenu);
    maincont.appendChild(finishedtask);
    

    return maincont;
}

function deletepr(){

    let head = this.parentNode;
    let maincont = head.parentNode;
    let main = maincont.parentNode;
    let warning = confirm("Are you sure that you want to delete this project?");
    

    if(warning == true){
    $.delete(`${url}/todo/${maincont.id}`,function(responseText){

        main.removeChild(maincont);
        console.log(responseText);   
    });
    }
}

function editpr(){

let label = this.parentNode.querySelector('label');
let innertext = label.innerText;
let head = this.parentNode;
let maincont = head.parentNode;
let editlabel = prompt("Edit your project:",label.innerText);
    
    if(editlabel == null){
        label.innerText = innertext;
    }
    else{
        label.innerText = editlabel;
    }
   $.put(`${url}/todo/${maincont.id}`,{

       newlabel: label.innerText,

   }, function(responseText){
       console.log(responseText);

   });
}

addtodolist.onclick = newtodo;


function taskdel(){

    let listitem = this.parentNode;
    let ul = listitem.parentNode;
    let maincont = ul.parentNode;
  
$.delete(`${url}/todo/${maincont.id}/task/${listitem.id}`,function(responseText){

 console.log(responseText);
 ul.removeChild(listitem);
 
});
}


function tasked(){
  
    let li = this.parentNode;
    let label = li.querySelector('label');
    let text = label.innerText;

    prevlabel = text;
  
    li.innerHTML = `<div class = 'task_block_check'>
    <input class = 'task_checkbox' type='checkbox'></div>
    <input class = 'task_input' type = 'text'>
    <button class = 'task_applyedit'></button>`;
     
    let input = li.querySelector('.task_input');
    input.value = text;
    input.focus();
    input.select();
    
    let apply = li.querySelector('.task_applyedit');
    apply.onclick = editmode;

}

function editmode(){

    let li = this.parentNode;
    let input = li.querySelector('.task_input');
    let text = input.value;
    let ul = li.parentNode;
    let maincont = ul.parentNode;
   
    li.innerHTML = `<div class = 'task_block_check'>
    <input class = 'task_checkbox' type='checkbox'></div>
    <label class = 'task_label'></label>
    <button class = 'task_prior'></button>
    <button class = 'task_edit'></button>
    <button class = 'task_delete'></button>`;

    let label = li.querySelector('label');
    label.innerText = text;
    bindtask(li);

    $.put(`${url}/todo/${maincont.id}/task/${li.id}`,{
        newlabel: label.innerText,
    },function(responseText){
        console.log(responseText);
    });

}

function taskpri(){

    let li = this.parentNode;
    let textLabel = li.querySelector('label').innerText;
    let ul = li.parentNode;
    let maincont = ul.parentNode;

    ul.removeChild(li);

    let priortasks = ul.parentNode.querySelector('.priortasks');
    let priorli = createnewelement(textLabel,li.id);
   

    priorli.style.backgroundColor = "#62c7e3";
    priorli.querySelector('label').style.color = "black";
    priorli.style.borderBottomLeftRadius = "0px";
    priorli.style.borderBottomRightRadius = "0px";

    priortasks.appendChild(priorli);
    bindtask(priorli);
    let delprior = priorli.querySelector('.task_prior');
    delprior.onclick = cancelprior;

    $.put(`${url}/todo/${maincont.id}/prior/task/${li.id}`, function(responseText){
        console.log(responseText);
    });

    
        
}

 function cancelprior(){


    let li = this.parentNode;
    let textLabel = li.querySelector('label').innerText;
    let ul = li.parentNode;
    let maincont = ul.parentNode;

    ul.removeChild(li);
    
    let taskmenu = ul.parentNode.querySelector('.taskmenu');
    let task = createnewelement(textLabel,li.id);

    taskmenu.appendChild(task);
    bindtask(task);

    $.put(`${url}/todo/${maincont.id}/cancelprior/task/${li.id}`, function(responseText){
        console.log(responseText);
    });

}

function finishtask(){

let div = this.parentNode;
let li = div.parentNode;
let text = li.querySelector('label').innerText;
let ul = li.parentNode;
let maincont = ul.parentNode;

$.put(`${url}/todo/${maincont.id}/finish/task/${li.id}`, function(responseText){
   console.log(responseText);
   
   
});

ul.removeChild(li);
let finished = ul.parentNode.querySelector('.finishedtasks');
let finishedli = document.createElement('li');
finishedli.className = "task";
finishedli.id = li.id;

finishedli.innerHTML = `<div class = 'task_block_check'>
<input class = 'task_checkbox' type='checkbox'></div>
<label class = 'task_label'></label>
<button class = 'task_delete'></button>`;

finishedli.style.backgroundColor = "#c8dbcd";
finishedli.querySelector('label').innerText = text;
finishedli.querySelector('label').style.color = "green";
finishedli.querySelector('.task_delete').style.width = "90px";
finishedli.querySelector('.task_delete').onclick = taskdel;
finishedli.querySelector('.task_checkbox').checked = true;
finishedli.querySelector('.task_checkbox').onclick = unfinishtask;


finished.appendChild(finishedli);

let list = finished.querySelectorAll('li');
list[0].style.borderTopLeftRadius = "10px";
list[0].style.borderTopRightRadius = "10px";


}

function unfinishtask(){

    let div = this.parentNode;
    let li = div.parentNode;
    let text = li.querySelector('label').innerText;
    let ul = li.parentNode;
    let maincont = ul.parentNode;
   
    $.put(`${url}/todo/${maincont.id}/unfinish/task/${li.id}`, function(responseText){
        console.log(responseText);
    });

    ul.removeChild(li);

    let unfinishedul = ul.parentNode.querySelector('.taskmenu');
    let unfinishedli = createnewelement(text,li.id);
    unfinishedul.appendChild(unfinishedli);
    bindtask(unfinishedli);

}

function bindtask(listitem){
 
    let checkbox = listitem.querySelector('.task_checkbox');
    let deletetask = listitem.querySelector('button.task_delete');
    let edittask = listitem.querySelector('button.task_edit');
    let priortask = listitem.querySelector('button.task_prior');

    checkbox.onclick = finishtask;
    deletetask.onclick = taskdel;
    edittask.onclick = tasked;
    priortask.onclick = taskpri;

}

function bindproject(maincont){
    
    let newtask = maincont.querySelector('.addtask button.addtask_button');
    let deletepro = maincont.querySelector('.project_delete');
    let editproject = maincont.querySelector('.project_edit');

    editproject.onclick = editpr;
    deletepro.onclick = deletepr;
    newtask.onclick = addnewtask;

}
