import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {

    // Modal elements
    const registerModal = document.getElementById('register-modal');
    const travelModal = document.getElementById('travel-modal');
    const cashInModal = document.getElementById('cashin-modal');
    const editModal = document.getElementById('edit-passenger-modal');
    const deleteModal = document.getElementById('delete-confirmation-modal');
    
    // Button elements
    const registerBtn = document.getElementById('register-btn');
    const travelBtn = document.getElementById('travel-btn');
    const cashInBtn = document.getElementById('cashin-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const closeButtons = document.querySelectorAll('.close-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');

    // Form elements
    const registerForm = document.getElementById('register-form');
    const travelForm = document.getElementById('travel-form');
    const cashInForm = document.getElementById('cashin-form');
    const editForm = document.getElementById('edit-passenger-form');

    let currentDeleteTarget = null;

    // Modal handlers
    registerBtn.addEventListener('click', () => registerModal.classList.add('active'));
    travelBtn.addEventListener('click', () => travelModal.classList.add('active'));
    cashInBtn.addEventListener('click', () => cashInModal.classList.add('active'));

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            registerModal.classList.remove('active');
            travelModal.classList.remove('active');
            cashInModal.classList.remove('active');
            editModal.classList.remove('active');
            deleteModal.classList.remove('active');
        });
    });

    // Logout handler
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
    });

    // Form submit handlers
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            RFID: e.target.rfid.value,
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            phoneNumber: e.target.phoneNumber.value,
            currentBalance: parseFloat(e.target.initialBalance.value)
        };

        try {
            await registerPassenger(formData);
            registerModal.classList.remove('active');
            fetchPassengers();
            e.target.reset();
        } catch (error) {
            console.error('Error registering passenger:', error);
            alert('Failed to register passenger');
        }
    });

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            rfid: e.target.rfid.value,
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            phoneNumber: e.target.phoneNumber.value
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/passenger/${formData.rfid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update passenger');

            editModal.classList.remove('active');
            fetchPassengers();
            e.target.reset();
        } catch (error) {
            console.error('Error updating passenger:', error);
            alert('Failed to update passenger');
        }
    });

    travelForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            RFID: e.target.rfid.value,
            destination: e.target.destination.value,
            fare: parseFloat(e.target.fare.value)
        };

        try {
            await processTravelPayment(formData);
            travelModal.classList.remove('active');
            fetchPassengers();
            fetchTransactions();
            e.target.reset();
        } catch (error) {
            console.error('Error processing travel payment:', error);
            alert('Failed to process travel payment');
        }
    });

    cashInForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            RFID: e.target.rfid.value,
            amount: parseFloat(e.target.amount.value)
        };

        try {
            await cashIn(formData);
            cashInModal.classList.remove('active');
            fetchPassengers();
            fetchTransactions();
            e.target.reset();
        } catch (error) {
            console.error('Error processing cash-in:', error);
            alert('Failed to process cash-in');
        }
    });

    // Delete confirmation handler
    confirmDeleteBtn.addEventListener('click', async () => {
        console.log("delete")

        if (!currentDeleteTarget) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/passenger/${currentDeleteTarget}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to delete passenger');

            deleteModal.classList.remove('active');
            fetchPassengers();
            currentDeleteTarget = null;
        } catch (error) {
            console.error('Error deleting passenger:', error);
            alert('Failed to delete passenger');
        }
    });

    // Initial data fetch
    fetchPassengers();
    fetchTransactions();

    // Add filter sections to tables
    const passengerSection = document.querySelector('#passenger-records .section-header');
    const transactionSection = document.querySelector('#transactions .section-header');

    const passengerFilters = document.createElement('div');
    passengerFilters.className = 'table-filters';
    passengerFilters.innerHTML = `
        <div class="filter-group">
            <label for="passenger-search">Search:</label>
            <input type="text" id="passenger-search" placeholder="Name, RFID, Phone...">
        </div>
    `;

    const transactionFilters = document.createElement('div');
    transactionFilters.className = 'table-filters';
    transactionFilters.innerHTML = `
        <div class="filter-group">
            <label for="transaction-search">Search:</label>
            <input type="text" id="transaction-search" placeholder="RFID, Type...">
        </div>
        <div class="filter-group">
            <label for="transaction-type">Type:</label>
            <select id="transaction-type">
                <option value="">All</option>
                <option value="Cash-in">Cash-in</option>
                <option value="Payment">Payment</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="date-range">Date:</label>
            <input type="date" id="transaction-date">
        </div>
    `;

    passengerSection.insertAdjacentElement('afterend', passengerFilters);
    transactionSection.insertAdjacentElement('afterend', transactionFilters);

    // Add filter event listeners
    document.getElementById('passenger-search').addEventListener('input', filterPassengers);
    document.getElementById('transaction-search').addEventListener('input', filterTransactions);
    document.getElementById('transaction-type').addEventListener('change', filterTransactions);
    document.getElementById('transaction-date').addEventListener('change', filterTransactions);
});

function fetchPassengers() {
    fetch(`${config.API_BASE_URL}/api/passengers`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch passengers');
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#passenger-table tbody');
            tableBody.innerHTML = '';
            data.forEach(passenger => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${passenger.RFID || '-'}</td>
                    <td>${passenger.FirstName || '-'}</td>
                    <td>${passenger.LastName || '-'}</td>
                    <td>${passenger.PhoneNumber || '-'}</td>
                    <td class="balance">₱${(passenger.CurrentBalance || 0).toFixed(2)}</td>
                    <td>
                        <button onclick="editPassenger('${passenger.RFID}', '${passenger.FirstName}', '${passenger.LastName}', '${passenger.PhoneNumber}')">Edit</button>
                        <button class="destructive" onclick="deletePassenger('${passenger.RFID}')">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching passengers:', error));
}

function fetchTransactions() {
    fetch(`${config.API_BASE_URL}/api/transactions`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch transactions');
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#transactions-table tbody');
            const isAdmin = localStorage.getItem('role') === 'Admin';
            tableBody.innerHTML = '';
            data.forEach(transaction => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${transaction.RFID || '-'}</td>
                    <td>${transaction.TransactionType || '-'}</td>
                    <td>₱${(transaction.Amount || 0).toFixed(2)}</td>
                    <td>${transaction.Destination || '-'}</td>
                    <td>${transaction.Fare ? `₱${transaction.Fare.toFixed(2)}` : '-'}</td>
                    <td class="balance">₱${(transaction.RemainingBalance || 0).toFixed(2)}</td>
                    <td>${new Date(transaction.Timestamp).toLocaleString()}</td>
                    ${isAdmin ? `
                        <td>
                            <button class="destructive" onclick="deleteTransaction('${transaction.TransactionID}')">Delete</button>
                        </td>
                    ` : '<td>-</td>'}
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching transactions:', error));
}

// Helper functions for passenger management
window.editPassenger = function(rfid, firstName, lastName, phoneNumber) {
    const editModal = document.getElementById('edit-passenger-modal');
    const form = document.getElementById('edit-passenger-form');
    
    form.rfid.value = rfid;
    form.firstName.value = firstName;
    form.lastName.value = lastName;
    form.phoneNumber.value = phoneNumber;
    
    editModal.classList.add('active');
};

window.deletePassenger = function(rfid) {
    const deleteModal = document.getElementById('delete-confirmation-modal');
    window.currentDeleteTarget = rfid;
    deleteModal.classList.add('active');
};

window.deleteTransaction = function(transactionId) {
    const deleteModal = document.getElementById('delete-confirmation-modal');
    window.currentDeleteTarget = transactionId;
    deleteModal.classList.add('active');
};

function filterPassengers() {
    const searchTerm = document.getElementById('passenger-search').value.toLowerCase();
    const rows = document.querySelectorAll('#passenger-table tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterTransactions() {
    const searchTerm = document.getElementById('transaction-search').value.toLowerCase();
    const type = document.getElementById('transaction-type').value;
    const date = document.getElementById('transaction-date').value;
    const rows = document.querySelectorAll('#transactions-table tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const typeMatch = !type || row.children[1].textContent === type;
        const dateMatch = !date || row.children[6].textContent.includes(date);
        const searchMatch = text.includes(searchTerm);

        row.style.display = typeMatch && dateMatch && searchMatch ? '' : 'none';
    });
}
