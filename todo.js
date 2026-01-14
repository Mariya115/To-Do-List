if(localStorage.getItem("loggedIn")!=="true"){
    window.location.href="login.html";
}

const list = document.getElementById("taskList");
const datePicker = document.getElementById("datePicker");

datePicker.valueAsDate = new Date();
loadTasks();

datePicker.addEventListener("change", loadTasks);

function getKey(){
    return "tasks_" + datePicker.value;
}

function addTask(){
    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority").value;
    if(input.value==="") return;

    const tasks = getTasks();
    tasks.push({text:input.value, priority, done:false});
    saveTasks(tasks);

    input.value="";
    loadTasks();
}

function createTask(task,index){
    const li = document.createElement("li");
    li.classList.add(task.priority);
    if(task.done) li.classList.add("completed");

    const span = document.createElement("span");
    span.innerText = task.text;
    span.className="task-text";
    span.onclick=()=>{
        task.done=!task.done;
        updateTask(index,task);
    };

    const editBtn=document.createElement("button");
    editBtn.innerText="✏️";
    editBtn.className="action-btn";
    editBtn.onclick=()=>{
        const t=prompt("Edit task",task.text);
        if(t){ task.text=t; updateTask(index,task); }
    };

    const delBtn=document.createElement("button");
    delBtn.innerText="🗑";
    delBtn.className="action-btn";
    delBtn.onclick=()=>{
        const tasks=getTasks();
        tasks.splice(index,1);
        saveTasks(tasks);
        loadTasks();
    };

    li.append(span,editBtn,delBtn);
    list.appendChild(li);
}

function loadTasks(){
    list.innerHTML="";
    getTasks().forEach((t,i)=>createTask(t,i));
}

function getTasks(){
    return JSON.parse(localStorage.getItem(getKey())) || [];
}

function saveTasks(tasks){
    localStorage.setItem(getKey(), JSON.stringify(tasks));
}

function updateTask(i,task){
    const tasks=getTasks();
    tasks[i]=task;
    saveTasks(tasks);
    loadTasks();
}

function logout(){
    localStorage.removeItem("loggedIn");
    window.location.href="login.html";
}
