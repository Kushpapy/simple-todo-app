let todo = JSON.parse(localStorage.getItem("todo")) || [];

const todoInput = document.getElementById("todoInput");
const todoList = document.querySelector(".scroll");
const clearButton = document.getElementById("deleteButton");
const todoCount = document.getElementById("todo-count");
const sortByAll = document.getElementById("sortBy-all");
const sortByActive = document.getElementById("sortBy-active");
const sortByCompleted = document.getElementById("sortBy-completed");
const activeSetting = document.querySelectorAll(".setting");

//initialize

document.addEventListener("DOMContentLoaded", function () {
  todoInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      addTasks();
    }
  });
  clearButton.addEventListener("click", deleteTasks);
  sortByAll.addEventListener("click", function () {
    displayTasks();
  });
  sortByActive.addEventListener("click", function () {
    todo = todo.sort((a, b) => {
      // Sort by 'disabled' property (false first)
      return a.disabled === b.disabled ? 0 : a.disabled ? 1 : -1;
    });
    displayTasks();
  });
  sortByCompleted.addEventListener("click", function () {
    todo = todo.sort((a, b) => {
      // Sort by 'disabled' property (true first)
      return a.disabled === b.disabled ? 0 : a.disabled ? -1 : 1;
    });
    displayTasks();
  });
  activeSetting.forEach((el) => {
    el.addEventListener("click", function (e) {
      const clicked = e.target;

      activeSetting.forEach((otherSetting) => {
        if (
          otherSetting !== clicked &&
          otherSetting.classList.contains("active")
        ) {
          otherSetting.classList.remove("active");
        }
      });

      clicked.classList.add("active");
    });
  });
  displayTasks();
});

function addTasks() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({
      text: newTask,
      disabled: false,
    });

    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

function displayTasks() {
  todoList.innerHTML = "";
  todo.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
    <div class="todo-item-container">
    <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
    <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>
      </div>
  </div>
  `;
    li.querySelector(".todo-checkbox").addEventListener("change", () =>
      toggleTasks(index)
    );
    todoList.append(li);
  });
  todoCount.textContent = todo.length;
}

function toggleTasks(index) {
  todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

function deleteTasks() {
  todo = todo.filter((item) => item.disabled !== true);
  saveToLocalStorage();
  displayTasks();
}
