const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const errorEl = document.getElementById("error");
const clearBtn = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter");

const FILTER_DATASET = {
  ALL: 'all',
  ACTIVE: 'active',
  DONE: 'done'
};

let tasks = [];
let currentFilter = FILTER_DATASET.ALL; //all | active | done
let nextId = 1;

function getActiveTasks() {
  return tasks.filter((t) => !t.done);
}

function getCompletedTasks() {
  return tasks.filter((t) => t.done);
}

function addTask() {
  const text = input.value;
  errorEl.setAttribute("hidden", "");

  if (!text || text.trim() === "") {
    errorEl.removeAttribute("hidden");
    return;
  }
  tasks.push({ id: nextId++, text: text, done: false });
  input.value = "";
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  task.done = !task.done;
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  render();
}

function clearCompleted() {
  tasks = getActiveTasks();
  render();
}

function getVisibleTasks() {
  if (currentFilter === FILTER_DATASET.ACTIVE) return getActiveTasks();
  if (currentFilter === FILTER_DATASET.DONE) return getCompletedTasks();

  return tasks;
}

function updateCounter() {
  counter.textContent = "Активных задач: " + getActiveTasks().length;
}

function render() {
  const visible = getVisibleTasks();
  list.replaceChildren();

  for (let i = 0; i <= visible.length - 1; i++) {
    const task = visible[i];
    const li = document.createElement("li");
    li.className = "task";
    if (task.done) {
      li.classList.add("done");
    }

    const span = document.createElement("span");
    span.className = "task__text";
    span.textContent = task.text;
    span.addEventListener("click", () => toggleTask(task.id));

    const del = document.createElement("button");
    del.className = "task__del";
    del.textContent = "✕";
    del.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  }
  updateCounter();
}

addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearCompleted);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
