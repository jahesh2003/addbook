$(document).ready(function () {
    let contacts = [];
    let currentEditIndex = null;

    // Show/Hide Error
    function showError(message) {
        $('#error-message').text(message).removeClass('hidden');
    }

    function hideError() {
        $('#error-message').addClass('hidden').text('');
    }

    // Validate Single Contact
    function validateForm() {
        let isValid = true;
        $('#contact-form input').each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                showError('Please fill out all fields.');
                return false;
            }
        });
        const phone = $('#phone').val();
        if (isValid && phone.length !== 11) {
            showError('Please enter a valid 11-digit phone number.');
            isValid = false;
        }
        if (isValid && isDuplicate(phone)) {
            showError('Phone number already exists.');
            isValid = false;
        }
        if (isValid) hideError();
        return isValid;
    }

    // Check Duplicates
    function isDuplicate(phone, excludeIndex = null) {
        return contacts.some((c, i) => c.phone === phone && i !== excludeIndex);
    }

    // Add Contact
    function addContact() {
        if (!validateForm()) return;
        contacts.push({
            name: $('#name').val(),
            surname: $('#surname').val(),
            phone: $('#phone').val(),
            address: $('#address').val(),
        });
        displayContacts();
        $('#contact-form')[0].reset();
    }

    $('#add-btn').click(function (e) {
        e.preventDefault();
        addContact();
    });

    // Display Contacts
    function displayContacts() {
        $('#contact-list').empty();
        contacts.forEach((c, index) => {
            $('#contact-list').append(`
                <tr>
                    <td>${c.name}</td>
                    <td>${c.surname}</td>
                    <td>${c.phone}</td>
                    <td>${c.address}</td>
                    <td>
                        <button id="edit-btn" data-index="${index}"><i class="fa fa-edit"></i></button>
                        <button id="delete-btn" data-index="${index}"><i class="fa fa-trash"></i></button>
                    </td>
                </tr>
            `);
        });
    }

    // Bulk Upload CSV
    function parseCSV(content) {
        return content
            .trim()
            .split("\n")
            .map(row => {
                const [name, surname, phone, address] = row.split(",").map(item => item.trim());
                return { name, surname, phone, address };
            });
    }

    function validateBulkData(data) {
        return data.every(c => c.name && c.surname && c.phone && c.address && c.phone.length === 11 && !isDuplicate(c.phone));
    }

    $('#upload-btn').click(function (e) {
        e.preventDefault();
        const file = $('#csv-file')[0].files[0];
        if (!file) {
            showError('Please select a file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            const parsedData = parseCSV(content);
            if (validateBulkData(parsedData)) {
                contacts = [...contacts, ...parsedData];
                displayContacts();
                hideError();
            } else {
                showError('Invalid or duplicate entries found.');
            }
        };
        reader.readAsText(file);
    });

    // Search Contacts
    $('#search-bar').on('input', function () {
        const query = $(this).val().toLowerCase();
        $('#contact-list tr').each(function () {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(query));
        });
    });
});
