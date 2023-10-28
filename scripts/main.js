const tasks = [];
const RENDER_EVENT = 'render-task';

function generateId() {
  return +new Date();
};

function generateTaskObject (id, task, date, isCompleted) {
  return {
    id,
    task,
    date,
    isCompleted,
  };
};

function addTask() {
  const taskName = document.getElementById('inputTask').value;
  const taskDate = document.getElementById('inputDate').value;

  const generateID = generateId();
  const taskObject = generateTaskObject(generateID, taskName, taskDate, false);
  tasks.push(taskObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
};

document.addEventListener('DOMContentLoaded', function () {
  const submitTask = document.getElementById('inputForm');

  submitTask.addEventListener('submit', function (event) {
    event.preventDefault();
    addTask();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  console.log(tasks);
});
