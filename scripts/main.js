const tasks = [];
const RENDER_EVENT = 'render-task';
const SAVED_EVENT = 'saved-task';
const STORAGE_KEY = 'DOIST';

const generateId = () => {
  return +new Date();
};

const generateTaskObject = (id, task, date, isCompleted) => {
  return {
    id,
    task,
    date,
    isCompleted,
  };
};

const addTask = () => {
  const taskName = document.getElementById('inputTask').value;
  const taskDate = document.getElementById('inputDate').value;

  const generateID = generateId();
  const taskObject = generateTaskObject(generateID, taskName, taskDate, false);
  tasks.push(taskObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const makeTask = (taskObject) => {
  const textName = document.createElement('h3');
  textName.innerText = taskObject.task;

  const textDate = document.createElement('p');
  textDate.innerText = taskObject.date;

  const textContainer = document.createElement('div');
  textContainer.classList.add('task-item__text');
  textContainer.append(textName, textDate);

  const container = document.createElement('div');
  container.classList.add('task-item');
  container.append(textContainer);
  container.setAttribute('id', `task-${taskObject.id}`);

  if (taskObject.isCompleted) {
    const undoIcon = document.createElement('span');
    undoIcon.classList.add('fa-solid', 'fa-rotate-left', 'fa-lg');
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.append(undoIcon);

    undoButton.addEventListener('click', () => {
      undoTaskFromCompleted(taskObject.id);
    });

    const trashIcon = document.createElement('span');
    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-lg');
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.append(trashIcon);

    trashButton.addEventListener('click', () => {
      removeTaskFromCompleted(taskObject.id);
    });

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('task-item__actions');
    actionContainer.append(undoButton, trashButton);

    container.append(actionContainer);
  } else {
    const checkIcon = document.createElement('span');
    checkIcon.classList.add('fa-solid', 'fa-circle-check', 'fa-lg');
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.append(checkIcon);

    checkButton.addEventListener('click', () => {
      addTaskToCompleted(taskObject.id);
    });

    const trashIcon = document.createElement('span');
    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-lg');
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.append(trashIcon);

    trashButton.addEventListener('click', () => {
      removeTaskFromCompleted(taskObject.id);
    });

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('task-item__actions');
    actionContainer.append(checkButton, trashButton);

    container.append(actionContainer);
  }

  return container;
};

const addTaskToCompleted = (taskId) => {
  const taskTarget = findTask(taskId);

  if (taskTarget == null) return;

  taskTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const findTask = (taskId) => {
  for (const taskItem of tasks) {
    if (taskItem.id === taskId) {
      return taskItem;
    }
  }

  return null;
};

const removeTaskFromCompleted = (taskId) => {
  const taskTarget = findTaskIndex(taskId);

  if (taskTarget === -1) return;

  tasks.splice(taskTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const findTaskIndex = (taskId) => {
  for (const index in tasks) {
    if (tasks[index].id === taskId) {
      return index;
    }
  }

  return -1;
};

const undoTaskFromCompleted = (taskId) => {
  const taskTarget = findTask(taskId);

  if (taskTarget == null) return;

  taskTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

document.addEventListener('DOMContentLoaded', () => {
  let today = new Date().toISOString().split('T')[0];
  document.getElementsByName('date')[0].setAttribute('min', today);

  const submitTask = document.getElementById('inputForm');

  submitTask.addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
    submitTask.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const undoneTasks = document.getElementById('tasks');
  undoneTasks.innerHTML = '';

  const doneTasks = document.getElementById('completed-tasks');
  doneTasks.innerHTML = '';

  for (const taskItem of tasks) {
    const taskElement = makeTask(taskItem);
    if (!taskItem.isCompleted) {
      undoneTasks.append(taskElement);
    } else {
      doneTasks.append(taskElement);
    }
  }
});

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert('Your browser does not support local storage');
    return false;
  }

  return true;
};

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const task of data) {
      tasks.push(task);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};
