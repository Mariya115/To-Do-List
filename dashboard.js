// ===== LOGIN CHECK =====
if(localStorage.getItem("loggedIn") !== "true"){
    window.location.href = "login.html";
}

// ===== ELEMENTS =====
const list = document.getElementById("taskList");
const datePicker = document.getElementById("datePicker");

const taskView = document.getElementById("taskView");
const progressView = document.getElementById("progressView");
const historyView = document.getElementById("historyView");

const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const historyList = document.getElementById("historyList");

// ===== DATE =====
datePicker.valueAsDate = new Date();
loadTasks();
datePicker.addEventListener("change", loadTasks);

// ===== STORAGE KEY =====
function key(){
    return "tasks_" + datePicker.value;
}

// ===== TASK FUNCTIONS =====

function addTask(){
    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority").value;

    if(input.value === "") return;

    const tasks = getTasks();
    tasks.push({ text: input.value, priority, done: false });
    save(tasks);

    input.value = "";
    loadTasks();
}

function loadTasks(){
    list.innerHTML = "";
    const tasks = getTasks();
    tasks.forEach((t, i) => render(t, i));
}

function render(task, i){
    const li = document.createElement("li");
    li.className = `task-item ${task.priority}`;
    if(task.done) li.classList.add("completed");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;

    check.onchange = () => {
        task.done = check.checked;
        update(i, task);
    };

    const span = document.createElement("span");
    span.innerText = task.text;
    span.className = "task-text";

    const edit = document.createElement("button");
    edit.innerText = "✏️";
    edit.className = "action-btn";
    edit.onclick = () => {
        const t = prompt("Edit task:", task.text);
        if(t){
            task.text = t;
            update(i, task);
        }
    };

    const del = document.createElement("button");
    del.innerText = "🗑";
    del.className = "action-btn";
    del.onclick = () => {
        const t = getTasks();
        t.splice(i, 1);
        save(t);
        loadTasks();
    };

    li.append(check, span, edit, del);
    list.appendChild(li);
}

// ===== STORAGE =====

function getTasks(){
    return JSON.parse(localStorage.getItem(key())) || [];
}

function save(t){
    localStorage.setItem(key(), JSON.stringify(t));
}

function update(i, task){
    const t = getTasks();
    t[i] = task;
    save(t);
    loadTasks();
}

// ===== SIDEBAR NAVIGATION =====

function showTasks(){
    taskView.style.display = "block";
    progressView.style.display = "none";
    historyView.style.display = "none";
}

function showProgress(){
    taskView.style.display = "none";
    progressView.style.display = "block";
    historyView.style.display = "none";

    const tasks = getTasks();

    if(tasks.length === 0){
        progressPercent.innerText = "0% Completed";
        progressText.innerText = "No tasks yet 😴";
        progressFill.style.width = "0%";
        return;
    }

    const done = tasks.filter(t => t.done).length;
    const percent = Math.round((done / tasks.length) * 100);

    progressPercent.innerText = `${percent}% Completed`;
    progressText.innerText = `${done} of ${tasks.length} tasks done 💪`;
    progressFill.style.width = percent + "%";
}

function showHistory(){
    taskView.style.display = "none";
    progressView.style.display = "none";
    historyView.style.display = "block";
    loadHistory();
}

// ===== HISTORY =====

function loadHistory(){
    historyList.innerHTML = "";

    let found = false;

    for(let i = 0; i < localStorage.length; i++){
        const k = localStorage.key(i);

        if(k.startsWith("tasks_")){
            found = true;
            const date = k.replace("tasks_", "");
            const tasks = JSON.parse(localStorage.getItem(k));

            const li = document.createElement("li");
            li.className = "task-item";
            li.innerHTML = `<b>${date}</b> — ${tasks.length} tasks`;

            li.onclick = () => {
                datePicker.value = date;
                showTasks();
                loadTasks();
            };

            historyList.appendChild(li);
        }
    }

    if(!found){
        historyList.innerHTML = "<p>No task history yet 💔</p>";
    }
}

// ===== LOGOUT =====

function logout(){
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}
