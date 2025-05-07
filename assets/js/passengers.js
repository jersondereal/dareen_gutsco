import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Modal elements
    const registerModal = document.getElementById('register-modal');
    const editModal = document.getElementById('edit-passenger-modal');
    const deleteModal = document.getElementById('delete-confirmation-modal');
    
    // Button elements
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const closeButtons = document.querySelectorAll('.close-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');

    // Check user role and hide register button if passenger
    const userRole = localStorage.getItem('role');
    const isPassenger = userRole === 'Passenger';
    if (isPassenger && registerBtn) {
        registerBtn.style.display = 'none';
    }

    // Form elements
    const registerForm = document.getElementById('register-form');
    const editForm = document.getElementById('edit-passenger-form');

    let currentDeleteTarget = null;

    // Modal handlers
    registerBtn?.addEventListener('click', () => registerModal.classList.add('active'));

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            registerModal?.classList.remove('active');
            editModal?.classList.remove('active');
            deleteModal?.classList.remove('active');
        });
    });

    // Logout handler
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/';
    });

    // Form submit handlers
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            RFID: e.target.rfid.value,
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            phoneNumber: e.target.phoneNumber.value,
            currentBalance: parseFloat(e.target.initialBalance.value)
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to register passenger');

            registerModal.classList.remove('active');
            fetchPassengers();
            e.target.reset();
        } catch (error) {
            console.error('Error registering passenger:', error);
            alert('Failed to register passenger');
        }
    });

    editForm?.addEventListener('submit', async (e) => {
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

    // Delete confirmation handler
    confirmDeleteBtn?.addEventListener('click', async () => {
        const targetRfid = window.currentDeleteTarget;
        if (!targetRfid) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/passenger/${targetRfid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to delete passenger');

            deleteModal.classList.remove('active');
            fetchPassengers();
            window.currentDeleteTarget = null;
        } catch (error) {
            console.error('Error deleting passenger:', error);
            alert('Failed to delete passenger');
        }
    });

    // Add filter sections to tables
    const passengerSection = document.querySelector('#passenger-records .section-header');

    const passengerFilters = document.createElement('div');
    passengerFilters.className = 'table-filters';
    passengerFilters.innerHTML = `
        <div class="filter-group">
            <label for="passenger-search">Search:</label>
            <input type="text" id="passenger-search" placeholder="Name, RFID, Phone...">
        </div>
    `;

    passengerSection?.insertAdjacentElement('afterend', passengerFilters);

    // Add filter event listeners
    document.getElementById('passenger-search')?.addEventListener('input', filterPassengers);

    // Initial data fetch
    fetchPassengers();
});

function fetchPassengers() {
    fetch(`${config.API_BASE_URL}/api/passengers`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch passengers');
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector('#passenger-table tbody');
            if (!tableBody) return;
            
            const userRole = localStorage.getItem('role');
            const isPassenger = userRole === 'Passenger';
            
            tableBody.innerHTML = '';
            data.forEach(passenger => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${passenger.RFID || '-'}</td>
                    <td>${passenger.FirstName || '-'}</td>
                    <td>${passenger.LastName || '-'}</td>
                    <td>${passenger.PhoneNumber || '-'}</td>
                    <td class="balance">₱${(parseFloat(passenger.CurrentBalance) || 0).toFixed(2)}</td>
                    ${!isPassenger ? `
                    <td>
                        <button onclick="editPassenger('${passenger.RFID}', '${passenger.FirstName}', '${passenger.LastName}', '${passenger.PhoneNumber}')">Edit</button>
                        <button class="destructive" onclick="deletePassenger('${passenger.RFID}')">Delete</button>
                    </td>
                    ` : '<td>-</td>'}
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching passengers:', error));
}

// Helper functions for passenger management
window.editPassenger = function(rfid, firstName, lastName, phoneNumber) {
    const editModal = document.getElementById('edit-passenger-modal');
    const form = document.getElementById('edit-passenger-form');
    
    if (!editModal || !form) return;
    
    form.rfid.value = rfid;
    form.firstName.value = firstName;
    form.lastName.value = lastName;
    form.phoneNumber.value = phoneNumber;
    
    editModal.classList.add('active');
};

window.deletePassenger = function(rfid) {
    const deleteModal = document.getElementById('delete-confirmation-modal');
    if (!deleteModal) return;
    
    window.currentDeleteTarget = rfid;
    deleteModal.classList.add('active');
};

function filterPassengers() {
    const searchTerm = document.getElementById('passenger-search')?.value.toLowerCase() || '';
    const rows = document.querySelectorAll('#passenger-table tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
} 