// js/dashboard.js
// Check if user is logged in
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
});

// Address Book functionality
class AddressBook {
    constructor() {
        this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    }

    addContact(contact) {
        this.contacts.push({
            id: Date.now(),
            ...contact,
            dateAdded: new Date().toISOString()
        });
        this.saveContacts();
    }

    getContacts() {
        return this.contacts;
    }

    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
}

const addressBook = new AddressBook();

// Update dashboard stats
document.getElementById('totalContacts').textContent = addressBook.getContacts().length;

// Show recent contacts
const recentContacts = addressBook.getContacts()
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, 5);

const recentContactsDiv = document.getElementById('recentContacts');
recentContacts.forEach(contact => {
    const div = document.createElement('div');
    div.className = 'recent-contact';
    div.textContent = `${contact.firstName} ${contact.lastName}`;
    recentContactsDiv.appendChild(div);
});
