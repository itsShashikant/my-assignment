document.getElementById('addCustomerButton').addEventListener('click', function() {
    // reset the form
    document.getElementById('customerForm').reset();
    // show the modal
    document.getElementById('customerModal').style.display = 'block';
});

document.getElementById('customerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var uuid = document.getElementById('uuid').value;
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var street = document.getElementById('street').value;
    var address = document.getElementById('address').value;
    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // hide the modal
            document.getElementById('customerModal').style.display = 'none';
            // refresh the customer list
            getCustomerList();
        }
    };
    if (uuid) {
        // update an existing customer
        xhr.open('POST', 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=' + uuid, true);
    } else {
        // add a new customer
        xhr.open('POST', 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create', true);
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    xhr.send(JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        street: street,
        address: address,
        city: city,
        state: state,
        email: email,
        phone: phone
    }));
});

function getCustomerList() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            var table = document.getElementById('customerTable');
            // clear the table
            table.innerHTML = '<tr><th>First Name</th><th>Last Name</th><th>Street</th><th>Address</th><th>City</th><th>State</th><th>Email</th><th>Phone</th><th>Actions</th></tr>';
            // populate the table with data
            for (var i = 0; i < response.length; i++) {
                var row = table.insertRow(-1);
                row.insertCell(0).innerHTML = response[i].first_name;
                row.insertCell(1).innerHTML = response[i].last_name;
                row.insertCell(2).innerHTML = response[i].street;
                row.insertCell(3).innerHTML = response[i].address;
                row.insertCell(4).innerHTML = response[i].city;
                row.insertCell(5).innerHTML = response[i].state;
                row.insertCell(6).innerHTML = response[i].email;
                row.insertCell(7).innerHTML = response[i].phone;
                row.insertCell(8).innerHTML =
                    '<button class="updateButton" data-uuid="' + response[i].uuid + '">Update</button>' +
                    '<button class="deleteButton" data-uuid="' + response[i].uuid + '">Delete</button>';
            }
        }
    };
    xhr.open('GET', 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    xhr.send();
}

// call getCustomerList on page load to populate the table with data
getCustomerList();

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('updateButton')) {
        // get the UUID of the customer to be updated
        var uuid = event.target.getAttribute('data-uuid');
        // pre-fill the form with the customer's data
        var row = event.target.parentNode.parentNode;
        document.getElementById('uuid').value = uuid;
        document.getElementById('firstName').value = row.cells[0].innerHTML;
        document.getElementById('lastName').value = row.cells[1].innerHTML;
        document.getElementById('street').value = row.cells[2].innerHTML;
        document.getElementById('address').value = row.cells[3].innerHTML;
        document.getElementById('city').value = row.cells[4].innerHTML;
        document.getElementById('state').value = row.cells[5].innerHTML;
        document.getElementById('email').value = row.cells[6].innerHTML;
        document.getElementById('phone').value = row.cells[7].innerHTML;
        // show the modal
        document.getElementById('customerModal').style.display = 'block';
    } else if (event.target.classList.contains('deleteButton')) {
        // get the UUID of the customer to be deleted
        var uuid = event.target.getAttribute('data-uuid');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // refresh the customer list
                getCustomerList();
            }
        };
        xhr.open('POST', 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=' + uuid, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
        xhr.send();
    }
});
