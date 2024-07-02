import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth(app);

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

// Sign-up
document.querySelector('.register-btn').addEventListener('click', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const password = document.getElementById('password').value;

    // Validate input
    if (!fullName || !email || !phoneNumber || !password) {
        alert('Please fill in all required fields.');
        return; 
    }

    console.log('Button clicked. Trying to write data to Firebase...');
    document.getElementById('loading-screen').style.display = 'flex';

    try {
        const customersRef = ref(db, 'users/customers');

        // Check if email already exists in customers 
        const customersSnapshot = await get(customersRef);
        if (customersSnapshot.exists()) {
            const customers = customersSnapshot.val();
            for (const customerKey in customers) {
                if (customers.hasOwnProperty(customerKey)) {
                    const customer = customers[customerKey];
                    if (customer.email === email) {
                        alert('Email already exists. Please use a different email.');
                        document.getElementById('loading-screen').style.display = 'none';
                        return;
                    }
                }
            }
        }

        // Check if email already exists in admin
        if (email === 'thomas.n@compfest.id') {
            alert('Email already exists. Please use a different email.');
            document.getElementById('loading-screen').style.display = 'none';
            return;
        };

        // Check if the entered credentials match admin credentials
        if (fullName === adminCredentials.fullName && email === adminCredentials.email && phoneNumber === adminCredentials.phoneNumber && password === adminCredentials.password) {
             // Declare userId and role for Admin account
            adminCredentials.userId = 0;
            adminCredentials.role = 'Admin';
            role = 'Admin';
            
            // Write data to firebase
            await set(ref(db, 'users/admin/' + fullName), {
                userId: adminCredentials.userId,
                fullName: adminCredentials.fullName,
                email: adminCredentials.email,
                phoneNumber: adminCredentials.phoneNumber,
                password: adminCredentials.password,
                role: adminCredentials.role
            });
        } else { 
            const userId = userIdIncrement;
            role = 'Customer';

            // Write user data to Firebase
            await set(ref(db, 'users/customers/' + fullName), {
                userId: userId,
                fullName: fullName,
                email: email,
                phoneNumber: phoneNumber,
                password: password,
                role: role
            });
            // Increment userId for next user
            userIdIncrement += 1;

            localStorage.setItem('userId', userIdIncrement);
        }
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            // Redirect to login page
            window.location.href = 'login.html';
            alert('Account registered Successfully');
        }, 2000); 

        // Save role (customers/admin)
        localStorage.setItem('role', role);
    } catch (error) {
        // Check if error writing to database
        console.error('Error writing to Firebase Realtime Database:', error);
        alert('Register failed. Please try again.');
        document.getElementById('loading-screen').style.display = 'none';
    }
});