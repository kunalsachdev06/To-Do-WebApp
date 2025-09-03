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

function checkUserLogin() {
    var currentUser = localStorage.getItem('currentUser');
    var welcomeElement = document.getElementById('welcomeMessage');
    
    if (currentUser && welcomeElement) {
        welcomeElement.textContent = 'Welcome back, ' + currentUser + '!';
    }
}

function logout() {
    var confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        localStorage.removeItem('currentUser');
        alert('You have been logged out successfully!');
        window.location.href = './login.html';
    }
}

function moveTaskUp(taskId) {
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id === taskId) {
            if (i > 0) {
                var temp = allTasks[i];
                allTasks[i] = allTasks[i - 1];
                allTasks[i - 1] = temp;
                
                saveTasksToStorage();
                displayTasks();
                updateTaskCounter();
            }
            break;
        }
    }
}

function moveTaskDown(taskId) {
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id === taskId) {
            if (i < allTasks.length - 1) {
                var temp = allTasks[i];
                allTasks[i] = allTasks[i + 1];
                allTasks[i + 1] = temp;
                
                saveTasksToStorage();
                displayTasks();
                updateTaskCounter();
            }
            break;
        }
    }
}

function changeTaskPriority(taskId, newPriority) {
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id === taskId) {
            allTasks[i].priority = newPriority;
            saveTasksToStorage();
            displayTasks();
            updateTaskCounter();
            break;
        }
    }
}

function changeTaskDueDate(taskId, newDueDate) {
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id === taskId) {
            allTasks[i].dueDate = newDueDate;
            saveTasksToStorage();
            displayTasks();
            updateTaskCounter();
            break;
        }
    }
}

function getPriorityColor(priority) {
    if (priority === 'high') {
        return '#ff6b6b';
    } else if (priority === 'medium') {
        return '#ffd93d';
    } else {
        return '#6bcf7f';
    }
}

function getPriorityText(priority) {
    if (priority === 'high') {
        return 'High';
    } else if (priority === 'medium') {
        return 'Medium';
    } else {
        return 'Low';
    }
}

function formatDueDate(dueDate) {
    if (!dueDate) {
        return '';
    }
    
    var today = new Date();
    var due = new Date(dueDate);
    var timeDiff = due.getTime() - today.getTime();
    var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) {
        return 'Overdue by ' + Math.abs(daysDiff) + ' days';
    } else if (daysDiff === 0) {
        return 'Due today';
    } else if (daysDiff === 1) {
        return 'Due tomorrow';
    } else {
        return 'Due in ' + daysDiff + ' days';
    }
}

function addNewTask() {
    var inputBox = document.getElementById('taskInput');
    var prioritySelect = document.getElementById('prioritySelect');
    var dueDateInput = document.getElementById('dueDateInput');
    
    var taskText = inputBox.value;
    var priority = prioritySelect.value;
    var dueDate = dueDateInput.value;
    
    taskText = taskText.trim();
    if (taskText === '') {
        alert('Please write something!');
        return;
    }
    
    var newTask = {
        id: nextId,
        text: taskText,
        done: false,
        priority: priority,
        dueDate: dueDate,
        createdDate: new Date().toISOString()
    };

    allTasks.unshift(newTask);

    nextId = nextId + 1;
    
    inputBox.value = '';
    prioritySelect.value = 'medium';
    dueDateInput.value = '';
    
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
        
        if (!task.priority) {
            task.priority = 'medium';
        }
        if (!task.dueDate) {
            task.dueDate = '';
        }
        
        if (task.done === true) {
            taskClass = taskClass + ' completed';
            checkedText = 'checked';
        }
        
        var priorityColor = getPriorityColor(task.priority);
        var priorityText = getPriorityText(task.priority);
        var dueDateText = formatDueDate(task.dueDate);
        var dueDateClass = '';
        
        if (task.dueDate && !task.done) {
            var today = new Date();
            var due = new Date(task.dueDate);
            if (due < today) {
                dueDateClass = 'overdue';
            }
        }
        
        html = html + '<div class="' + taskClass + '">';
        html = html + '<input type="checkbox" class="task-checkbox" ' + checkedText + ' onchange="toggleTaskDone(' + task.id + ')">';
        
        html = html + '<div class="priority-indicator" style="background-color: ' + priorityColor + '" title="' + priorityText + ' Priority"></div>';
        
        html = html + '<div class="task-content">';
        html = html + '<div class="task-text">' + cleanText(task.text) + '</div>';
        
        if (dueDateText) {
            html = html + '<div class="due-date ' + dueDateClass + '">' + dueDateText + '</div>';
        }
        html = html + '</div>';
        
        html = html + '<div class="task-controls">';
        
        html = html + '<select class="priority-select" onchange="changeTaskPriority(' + task.id + ', this.value)">';
        html = html + '<option value="low"' + (task.priority === 'low' ? ' selected' : '') + '>Low</option>';
        html = html + '<option value="medium"' + (task.priority === 'medium' ? ' selected' : '') + '>Medium</option>';
        html = html + '<option value="high"' + (task.priority === 'high' ? ' selected' : '') + '>High</option>';
        html = html + '</select>';
        
        html = html + '<input type="date" class="due-date-input" value="' + (task.dueDate || '') + '" onchange="changeTaskDueDate(' + task.id + ', this.value)">';
        
        if (i > 0) {
            html = html + '<button class="move-btn move-up" onclick="moveTaskUp(' + task.id + ')" title="Move Up">⬆</button>';
        }
        if (i < tasksToShow.length - 1) {
            html = html + '<button class="move-btn move-down" onclick="moveTaskDown(' + task.id + ')" title="Move Down">⬇</button>';
        }
        
        html = html + '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">Delete</button>';
        html = html + '</div>';
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
