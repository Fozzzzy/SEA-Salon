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

// Check Admin
const adminCredentials = {
    fullName: 'Thomas N',
    email: 'thomas.n@compfest.id',
    phoneNumber: '08123456789',
    password: 'Admin123',
};

// Generate userId from 1 for every new user signing in
let userIdIncrement = localStorage.getItem('userId') || 1;
let role;

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
        const usersRef = ref(db, 'users/customers');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const userKey in users) {
                if (users.hasOwnProperty(userKey)) {
                    const user = users[userKey];
                    if (user.email === email && user.password === password) {
                        // Login successful
                        localStorage.setItem('userId', user.userId);
                        localStorage.setItem('role', user.role);
                        localStorage.setItem('loginMessage', `Login Successful, Welcome ${user.fullName}!`);
                        window.location.href = 'home.html'; // Redirect to home page
                        return true;
                    }
                }
            }
        }
        // If no matching user or incorrect credentials
        alert('Invalid email or password. Please try again.');
        return false;
        
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Login failed. Please try again.');
        return false;
    }
}