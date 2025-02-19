// 유저가 값을 입력한다
// + 버튼을 클릭하면 할 일이 추가된다
// 삭제 버튼을 클릭하면 할 일이 삭제된다
// 체크 버튼을 클릭하면 할 일이 끝나면서 밑줄이 그어진다
// 진행중, 끝남 탭을 누르면 언더바가 이동한다
// 끝남 탭은 끝난 아이템만, 진행중 탭은 진행중인 아이템만 보인다
// 전체 탭을 누르면 다시 전체 아이템으로 돌아옴

let taskInput = document.getElementById("task-input");

taskInput.addEventListener("focus", function () {
  taskInput.value = "";
});

let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".task-tabs div");
let taskList = [];
let mode = "all";
let filterList = [];

// 엔터키로도 작업 추가
taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

addButton.addEventListener("click", addTask);

for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

function addTask() {
  let taskContent = taskInput.value.trim();

  if (taskContent === "") {
    alert("할 일을 입력해주세요.");
    return;
  }

  let task = {
    id: randomIDGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };
  taskList.push(task);
  taskInput.value = "";
  render();
}

function render() {
  // 1. 내가 선택한 탭에 따라서
  let list;
  if (mode === "all") {
    list = taskList;
  } else if (mode === "done") {
    list = taskList.filter((task) => task.isComplete);
  } else if (mode === "ongoing") {
    list = taskList.filter((task) => !task.isComplete);
  }
  // 2. 리스트를 달리 보여준다
  // all taskLIst
  // ongoing, done filterList
  let resultHTML = "";

  list.forEach((task) => {
    let iconHTML = task.isComplete
      ? `<i class="fa-solid fa-check-square check-icon"></i>`
      : `<i class="fa-regular fa-square check-icon"></i>`;
    resultHTML += `
      <div class="task ${task.isComplete ? "task-complete" : ""}" id="${
      task.id
    }">
        <div>${task.taskContent}</div>
        <div>
          <button class="icon-btn toggle-btn" onclick="toggleComplete('${
            task.id
          }')">
            ${iconHTML}
          </button>
          <button class="icon-btn delete-btn" onclick="deleteTask('${
            task.id
          }')">
            <i class="fa-solid fa-trash delete-icon"></i>
          </button>
        </div>
      </div>`;
  });
  document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  render();
  console.log(taskList);
}

function deleteTask(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList.splice(i, 1);
      break;
    }
  }

  if (mode === "ongoing") {
    filterList = taskList.filter((task) => !task.isComplete);
  } else if (mode === "done") {
    filterList = taskList.filter((task) => task.isComplete);
  }
  render();
}

function filter(event) {
  mode = event.target.id;
  filterList = [];

  moveUnderline(event.target);

  if (mode === "all") {
    render();
  } else if (mode === "ongoing") {
    filterList = taskList.filter((task) => !task.isComplete);
  } else if (mode === "done") {
    filterList = taskList.filter((task) => task.isComplete);
  }
  render();
}

function moveUnderline(target) {
  let underline = document.getElementById("under-line");
  underline.style.left = target.offsetLeft + "px";
  underline.style.width = target.offsetWidth + "px";
}

function randomIDGenerate() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
