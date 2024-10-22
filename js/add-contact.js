// js/add-contact.js
// Check if user is logged in
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

const addressBook = new AddressBook();

document.getElementById('addContactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newContact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
    };

    addressBook.addContact(newContact);
    alert('Contact added successfully!');
    this.reset();
});
