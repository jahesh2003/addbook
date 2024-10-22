// js/view-contacts.js

class ContactsView {
    constructor() {
        this.addressBook = new AddressBook();
        this.contactsList = document.getElementById('contactsList');
        this.sortSelect = document.getElementById('sortBy');
        this.modal = document.getElementById('editModal');
        this.editForm = document.getElementById('editContactForm');
        
        this.initializeEventListeners();
        this.loadContacts();
    }

    initializeEventListeners() {
        // Sort functionality
        this.sortSelect.addEventListener('change', () => this.loadContacts());

        // Edit form submission
        this.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));

        // Modal close button
        document.querySelector('.close').addEventListener('click', () => {
            this.modal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target == this.modal) {
                this.modal.style.display = 'none';
            }
        });

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        });
    }

    loadContacts() {
        const contacts = this.addressBook.getContacts();
        const sortBy = this.sortSelect.value;

        // Sort contacts
        contacts.sort((a, b) => {
            if (sortBy === 'dateAdded') {
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            }
            return a[sortBy].localeCompare(b[sortBy]);
        });

        this.displayContacts(contacts);
    }

    displayContacts(contacts) {
        this.contactsList.innerHTML = '';
        
        contacts.forEach(contact => {
            const contactCard = document.createElement('div');
            contactCard.className = 'contact-card';
            contactCard.innerHTML = `
                <h3>${contact.firstName} ${contact.lastName}</h3>
                <p><i class="fas fa-envelope"></i> ${contact.email}</p>
                <p><i class="fas fa-phone"></i> ${contact.phone}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${contact.address}</p>
                <div class="button-group">
                    <button onclick="contactsView.editContact(${contact.id})" class="edit-btn">
                        Edit
                    </button>
                    <button onclick="contactsView.deleteContact(${contact.id})" class="delete-btn">
                        Delete
                    </button>
                </div>
            `;
            this.contactsList.appendChild(contactCard);
        });
    }

    editContact(id) {
        const contact = this.addressBook.getContactById(id);
        if (contact) {
            document.getElementById('editContactId').value = contact.id;
            document.getElementById('editFirstName').value = contact.firstName;
            document.getElementById('editLastName').value = contact.lastName;
            document.getElementById('editAddress').value = contact.address;
            document.getElementById('editPhone').value = contact.phone;
            document.getElementById('editEmail').value = contact.email;
            this.modal.style.display = 'block';
        }
    }

    handleEditSubmit(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('editContactId').value);
        const updatedContact = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            address: document.getElementById('editAddress').value,
            phone: document.getElementById('editPhone').value,
            email: document.getElementById('editEmail').value
        };

        this.addressBook.updateContact(id, updatedContact);
        this.modal.style.display = 'none';
        this.loadContacts();
    }

    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.addressBook.deleteContact(id);
            this.loadContacts();
        }
    }
}

// Check if user is logged in
if (!localStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

// Initialize the view
const contactsView = new ContactsView();
