//hoping this works
//i can delete
function validateLogin() {
    const connection = mysql.createConnection({
        host: '35.237.115.8',
        user: 'asiaosimeh',
        password: 'clubreads2024',
        database: 'RegisterDB'
    });

    connection.connect();
//moves to server.js file
    function validateLogin() {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password_hash').value;

        connection.query('SELECT * FROM Users WHERE username = ? AND password_hash = ?', [username, password_hash], function (error, results, fields) {
            if (error) throw error;

            if (results.length > 0) {
                alert('Login successful!');
            } else {
                alert('Invalid username or password.');
            }
        });
//stays in this file
    }function validateLogin() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === 'admin' && password === 'password') {
        alert('Login successful!');
    } else {
        alert('Invalid username or password.');
    }
}

