// Login page JavaScript - Beginner friendly code

function checkLogin() {
    // Get the input values
    var usernameInput = document.querySelector('input[name="username"]');
    var passwordInput = document.querySelector('input[name="password"]');
    
    var username = usernameInput.value;
    var password = passwordInput.value;
    
    // Remove any extra spaces
    username = username.trim();
    password = password.trim();
    
    // Check if both fields are filled
    if (username === '' || password === '') {
        alert('Please fill in both username and password!');
        return false; // Stop the login
    }
    
    // Check if username and password are long enough
    if (username.length < 3) {
        alert('Username must be at least 3 characters long!');
        return false;
    }
    
    if (password.length < 4) {
        alert('Password must be at least 4 characters long!');
        return false;
    }
    
    // If we get here, login is successful
    alert('Login successful! Welcome ' + username + '!');
    
    // Save username for the main page
    localStorage.setItem('currentUser', username);
    
    // Go to main page
    window.location.href = './main.html';
    
    return true;
}

// Function to clear the form
function clearForm() {
    var usernameInput = document.querySelector('input[name="username"]');
    var passwordInput = document.querySelector('input[name="password"]');
    var rememberCheckbox = document.querySelector('input[name="rememberme"]');
    
    usernameInput.value = '';
    passwordInput.value = '';
    rememberCheckbox.checked = false;
}

// When page loads, add enter key support
window.onload = function() {
    var usernameInput = document.querySelector('input[name="username"]');
    var passwordInput = document.querySelector('input[name="password"]');
    
    // If user presses Enter in username field, move to password
    usernameInput.onkeypress = function(event) {
        if (event.key === 'Enter') {
            passwordInput.focus();
        }
    };
    
    // If user presses Enter in password field, try to login
    passwordInput.onkeypress = function(event) {
        if (event.key === 'Enter') {
            checkLogin();
        }
    };
};
