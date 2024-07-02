import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, onValue, set, push, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Web Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBkbI2FtxAQJwkITY22ige80ZxvTPeUHro",
    authDomain: "seasalon-34f4b.firebaseapp.com",
    projectId: "seasalon-34f4b",
    storageBucket: "seasalon-34f4b.appspot.com",
    messagingSenderId: "707554349089",
    appId: "1:707554349089:web:1726668d9e4f9606361360",
    measurementId: "G-KHBE00KB82",
    databaseURL: "https://seasalon-34f4b-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get reference to database services
const db = getDatabase(app);

// Generate userId from 1 for every new user signing in
let userIdIncrement = localStorage.getItem('userId') || 1;

// Sign Up move Window
document.querySelector('.register-btn').addEventListener('click', () => {
    window.location.href = 'register.html';
    console.log("Hello");
});

// Login
document.querySelector('#login').addEventListener('click', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate input
    if (!email || !password) {
        alert('Please fill in all required fields.');
        return;
    }

    // Attempt to login
    await loginUser(email, password);
});

async function loginUser(email, password) {
    try {
        const customersRef = ref(db, 'users/customers');
        const customersSnapshot = await get(customersRef);

        // Check in admin
        if (email === 'thomas.n@compfest.id' && password === 'Admin123') {
            // Admin login successful
            localStorage.setItem('userId', 'admin');
            localStorage.setItem('role', 'Admin');
            localStorage.setItem('loginMessage', 'Admin Login Successful');
            window.location.href = 'home.html'; // Redirect to home page
            return true;
        }

        // Check in customers
        else if (customersSnapshot.exists()) {
            const customers = customersSnapshot.val();
            for (const customerKey in customers) {
                if (customers.hasOwnProperty(customerKey)) {
                    const customer = customers[customerKey];
                    if (customer.email === email && customer.password === password) {
                        // Customer login successful
                        localStorage.setItem('userId', customer.userId);
                        localStorage.setItem('role', 'Customer');
                        localStorage.setItem('loginMessage', `Login Successful, Welcome ${customer.fullName}!`);
                        window.location.href = 'home.html'; // Redirect to home page
                        return true;
                    }
                }
            }
        }
        

        // If incorrect credentials
        alert('Invalid email or password. Please try again.');
        return false;
        
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Login failed. Please try again.');
        return false;
    }
}
