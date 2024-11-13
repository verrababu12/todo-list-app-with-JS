let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  if (parsedTodoList === null) {
    return [];
  } else {
    return parsedTodoList;
  }
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

saveTodoButton.onclick = function () {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};

function onTodoStatusChange(checkboxId, labelId, todoId, editIconContainerId) {
  let checkboxElement = document.getElementById(checkboxId);
  let labelElement = document.getElementById(labelId);
  let editIconContainer = document.getElementById(editIconContainerId);
  console.log(editIconContainer);
  labelElement.classList.toggle("checked");

  let todoObjectIndex = todoList.findIndex(function (eachTodo) {
    let eachTodoId = "todo" + eachTodo.uniqueNo;

    if (eachTodoId === todoId) {
      return true;
    } else {
      return false;
    }
  });

  let todoObject = todoList[todoObjectIndex];

  if (todoObject.isChecked === true) {
    todoObject.isChecked = false;
  } else {
    todoObject.isChecked = true;
  }

  if (todoObject.isChecked) {
    editIconContainer.style.display = "none";
  } else {
    editIconContainer.style.display = "block";
  }
}

function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(todoId);
  todoItemsContainer.removeChild(todoElement);

  let deleteElementIndex = todoList.findIndex(function (eachTodo) {
    let eachTodoId = "todo" + eachTodo.uniqueNo;
    if (eachTodoId === todoId) {
      return true;
    } else {
      return false;
    }
  });

  todoList.splice(deleteElementIndex, 1);
}

function saveEditText(labelId, newText) {
  let todoObjectIndex = todoList.findIndex(function (eachTodo) {
    let eachTodoId = "label" + eachTodo.uniqueNo;
    if (eachTodoId === labelId) {
      return true;
    } else {
      return false;
    }
  });

  if (todoObjectIndex !== -1) {
    todoList[todoObjectIndex].text = newText;
  }
}

function onEditIcon(labelId) {
  let labelElement = document.getElementById(labelId);
  console.log(labelElement);

  let editInputElement = document.createElement("input");
  editInputElement.type = "text";
  editInputElement.classList.add("edit-input");
  editInputElement.value = labelElement.textContent;
  labelElement.textContent = "";
  labelElement.appendChild(editInputElement);

  editInputElement.addEventListener("blur", function () {
    saveEditText(labelId, editInputElement.value);
    labelElement.textContent = editInputElement.value;
  });

  editInputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      saveEditText(labelId, editInputElement.value);
      editInputElement.blur();
    }
  });
  editInputElement.focus();
}

function createAndAppendTodo(todo) {
  let todoId = "todo" + todo.uniqueNo;
  let checkboxId = "checkbox" + todo.uniqueNo;
  let labelId = "label" + todo.uniqueNo;
  let editIconContainerId = "editIconContainer" + todo.uniqueNo;

  let todoElement = document.createElement("li");
  todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
  todoElement.id = todoId;
  todoItemsContainer.appendChild(todoElement);

  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = checkboxId;
  inputElement.checked = todo.isChecked;

  inputElement.onclick = function () {
    onTodoStatusChange(checkboxId, labelId, todoId, editIconContainerId);
  };

  inputElement.classList.add("checkbox-input");
  todoElement.appendChild(inputElement);

  let labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container", "d-flex", "flex-row");
  todoElement.appendChild(labelContainer);

  let labelElement = document.createElement("label");
  labelElement.setAttribute("for", checkboxId);
  labelElement.id = labelId;
  labelElement.classList.add("checkbox-label");
  labelElement.textContent = todo.text;
  if (todo.isChecked === true) {
    labelElement.classList.add("checked");
  }
  labelContainer.appendChild(labelElement);

  let editIconContainer = document.createElement("div");
  editIconContainer.id = editIconContainerId;
  editIconContainer.classList.add("edit-icon-container");
  labelContainer.appendChild(editIconContainer);

  let editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid", "fa-pencil", "edit-icon");
  editIcon.onclick = function () {
    onEditIcon(labelId);
  };
  editIconContainer.appendChild(editIcon);

  let deleteIconContainer = document.createElement("div");
  deleteIconContainer.classList.add("delete-icon-container");
  labelContainer.appendChild(deleteIconContainer);

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

  deleteIcon.onclick = function () {
    onDeleteTodo(todoId);
  };

  deleteIconContainer.appendChild(deleteIcon);

  if (todo.isChecked) {
    editIconContainer.style.display = "none";
  } else {
    editIconContainer.style.display = "block";
  }
}

function onAddTodo() {
  let userInputElement = document.getElementById("todoUserInput");
  let userInputValue = userInputElement.value;

  if (userInputValue === "") {
    alert("Enter Valid Text");
    return;
  }

  todosCount = todosCount + 1;

  let newTodo = {
    text: userInputValue,
    uniqueNo: todosCount,
    isChecked: false,
  };
  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  userInputElement.value = "";
}
addTodoButton.onclick = function () {
  onAddTodo();
};

for (let todo of todoList) {
  createAndAppendTodo(todo);
}
