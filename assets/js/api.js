const API_BASE_URL = 'http://localhost:3000/api';

// Function to register a new passenger
async function registerPassenger(passengerData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(passengerData)
        });
        if (!response.ok) throw new Error('Failed to register passenger');
        return response.json();
    } catch (error) {
        console.error('Error registering passenger:', error);
        throw error;
    }
}

// Function to process travel payment
async function processTravelPayment(travelData) {
    try {
        const response = await fetch(`${API_BASE_URL}/travel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(travelData)
        });
        if (!response.ok) throw new Error('Failed to process travel payment');
        return response.json();
    } catch (error) {
        console.error('Error processing travel payment:', error);
        throw error;
    }
}

// Function to cash in
async function cashIn(cashInData) {
    try {
        const response = await fetch(`${API_BASE_URL}/cashin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cashInData)
        });
        if (!response.ok) throw new Error('Failed to process cash-in');
        return response.json();
    } catch (error) {
        console.error('Error processing cash-in:', error);
        throw error;
    }
}
