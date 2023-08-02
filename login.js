document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var loginId = document.getElementById('loginId').value;
    var password = document.getElementById('password').value;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            var token = response.token;
            // store the token for use in subsequent API calls
            localStorage.setItem('token', token);
            // redirect to the customer list screen
            window.location.href = 'customerList.html';
        }
    };
    xhr.open('POST', 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        login_id: loginId,
        password: password
    }));
});
