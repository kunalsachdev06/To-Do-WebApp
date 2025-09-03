var allTasks = [];
var filter = 'all';
var nextId = 1;

window.onload = function() {
    checkUserLogin();
    
    loadTasksFromStorage();
    displayTasks();
    updateTaskCounter();
    
    var inputBox = document.getElementById('taskInput');
    if (inputBox) {
        inputBox.onkeypress = function(event) {
            if (event.key === 'Enter') {
                addNewTask();
            }
        }
    }
};

// Check if user is logged in and show welcome message
function checkUserLogin() {
    var currentUser = localStorage.getItem('currentUser');
    var welcomeElement = document.getElementById('welcomeMessage');
    
    if (currentUser && welcomeElement) {
        welcomeElement.textContent = 'Welcome back, ' + currentUser + '!';
    }
}

// Logout function
function logout() {
    var confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        localStorage.removeItem('currentUser');
        alert('You have been logged out successfully!');
        window.location.href = './login.html';
    }
}

function addNewTask() {
    var inputBox = document.getElementById('taskInput');
    var taskText = inputBox.value;
    taskText = taskText.trim();
    if (taskText === '') {
        alert('Please write something!');
        return;
    }
    var newTask = {
        id: nextId,
        text: taskText,
        done: false
    };

    allTasks.unshift(newTask);

    nextId = nextId + 1;
    
    inputBox.value = '';
    
    saveTasksToStorage();
    displayTasks();
    updateTaskCounter();
}

function toggleTaskDone(taskId) {
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id === taskId) {
            if (allTasks[i].done === true) {
                allTasks[i].done = false;
            } else {
                allTasks[i].done = true;
            }
            break;
        }
    }
    
    saveTasksToStorage();
    displayTasks();
    updateTaskCounter();
}

function deleteTask(taskId) {
    var answer = confirm('Are you sure you want to delete this task?');
    
    if (answer === true) {
        var newTasks = [];
        for (var i = 0; i < allTasks.length; i++) {
            if (allTasks[i].id !== taskId) {
                newTasks.push(allTasks[i]);
            }
        }
        allTasks = newTasks;
        
        saveTasksToStorage();
        displayTasks();
        updateTaskCounter();
    }
}

function changeFilter(newFilter) {
    filter = newFilter;
    var allFilterButtons = document.querySelectorAll('.filter-btn');
    for (var i = 0; i < allFilterButtons.length; i++) {
        allFilterButtons[i].classList.remove('active');
    }
    if (newFilter === 'all') {
        document.getElementById('allBtn').classList.add('active');
    } else if (newFilter === 'active') {
        document.getElementById('activeBtn').classList.add('active');
    } else if (newFilter === 'completed') {
        document.getElementById('completedBtn').classList.add('active');
    }
    
    displayTasks();
}
function displayTasks() {
    var taskContainer = document.getElementById('taskList');
    var tasksToShow = [];
    if (filter === 'all') {
        tasksToShow = allTasks;
    } else if (filter === 'active') {
        for (var i = 0; i < allTasks.length; i++) {
            if (allTasks[i].done === false) {
                tasksToShow.push(allTasks[i]);
            }
        }
    } else if (filter === 'completed') {
        for (var i = 0; i < allTasks.length; i++) {
            if (allTasks[i].done === true) {
                tasksToShow.push(allTasks[i]);
            }
        }
    }
    
    if (tasksToShow.length === 0) {
        var message = '';
        if (filter === 'all') {
            message = 'No tasks yet. Add a task to start!';
        } else if (filter === 'active') {
            message = 'No active tasks!';
        } else {
            message = 'No completed tasks yet!';
        }
        taskContainer.innerHTML = '<div class="empty-message">' + message + '</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < tasksToShow.length; i++) {
        var task = tasksToShow[i];
        var taskClass = 'task-item';
        var checkedText = '';
        
        if (task.done === true) {
            taskClass = taskClass + ' completed';
            checkedText = 'checked';
        }
        
        html = html + '<div class="' + taskClass + '">';
        html = html + '<input type="checkbox" class="task-checkbox" ' + checkedText + ' onchange="toggleTaskDone(' + task.id + ')">';
        html = html + '<div class="task-text">' + cleanText(task.text) + '</div>';
        html = html + '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">Delete</button>';
        html = html + '</div>';
    }
    taskContainer.innerHTML = html;
}

function updateTaskCounter() {
    var activeTasks = [];
    var completedTasks = [];
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].done === false) {
            activeTasks.push(allTasks[i]);
        } else {
            completedTasks.push(allTasks[i]);
        }
    }
    var counter = document.getElementById('taskCount');
    var activeCount = activeTasks.length;
    
    if (activeCount === 1) {
        counter.textContent = '1 task left';
    } else {
        counter.textContent = activeCount + ' tasks left';
    }
    var clearButton = document.getElementById('clearBtn');
    if (completedTasks.length === 0) {
        clearButton.disabled = true;
    } else {
        clearButton.disabled = false;
    }
}
function clearAllCompleted() {
    var completedCount = 0;
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].done === true) {
            completedCount = completedCount + 1;
        }
    }
    if (completedCount === 0) {
        return;
    }
    var answer = confirm('Delete all ' + completedCount + ' completed tasks?');
    if (answer === true) {
        var activeTasks = [];
        for (var i = 0; i < allTasks.length; i++) {
            if (allTasks[i].done === false) {
                activeTasks.push(allTasks[i]);
            }
        }
        allTasks = activeTasks;
        
        saveTasksToStorage();
        displayTasks();
        updateTaskCounter();
    }
}
function saveTasksToStorage() {
    if (typeof(Storage) !== "undefined") {
        var tasksText = JSON.stringify(allTasks);
        var idText = nextId.toString();
        localStorage.setItem('myTodoTasks', tasksText);
        localStorage.setItem('myTodoId', idText);
    }
}

function loadTasksFromStorage() {
    if (typeof(Storage) !== "undefined") {
        var savedTasks = localStorage.getItem('myTodoTasks');
        var savedId = localStorage.getItem('myTodoId');
        if (savedTasks !== null) {
            allTasks = JSON.parse(savedTasks);
        }
        if (savedId !== null) {
            nextId = parseInt(savedId);
        }
    }
}

function cleanText(text) {
    var tempDiv = document.createElement('div');
    tempDiv.textContent = text;
    return tempDiv.innerHTML;
}
