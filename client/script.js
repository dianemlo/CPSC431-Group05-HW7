const taskList = document.getElementById("taskList");
const input = document.getElementById("taskInput");

let tasks = [];

function addTask() {
  if (input.value.trim() === "") return;

  tasks.push({
    text: input.value,
    done: false
  });

  input.value = "";
  render();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  render();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.done);
  render();
}

function render() {
  taskList.innerHTML = "";

  tasks.forEach((task, i) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.done ? "checked" : ""} 
          onclick="toggleTask(${i})"/>
        <span class="${task.done ? "completed" : ""}">
          ${task.text}
        </span>
      </div>
      <button onclick="deleteTask(${i})">x</button>
    `;

    taskList.appendChild(li);
  });

  document.getElementById("remaining").innerText =
    `${tasks.filter(t => !t.done).length} remaining`;
}

// date
const today = new Date();
document.getElementById("date").innerText =
  today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });