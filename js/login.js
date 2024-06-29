import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your web app's Firebase configuration
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


// Sign-up
document.querySelector('.sign-in-btn').addEventListener('click', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const password = document.getElementById('password').value;

    console.log("Button clicked. Trying to write data to Firebase...");

    try {
        // write operation for debugging
        await set(ref(db, 'test'), {
            testField: "testValue"
        });

        // write user data
        await set(ref(db, 'users/' + username), {
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            password: password
        });
        window.location.href = 'index.html';
        localStorage.setItem('loginMessage', 'Login Successful!');
    } catch (error) {
        console.error('Error writing to Firebase Realtime Database:', error);
        alert('Login failed. Please try again.');
    }
});

