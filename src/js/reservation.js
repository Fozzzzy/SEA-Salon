import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const db = getDatabase(app);

// Get DOM elements
const bookNowButton = document.querySelector('.reservation-book-now-btn');
const nameInput = document.getElementById('reservation-name');
const phoneNumberInput = document.getElementById('reservation-phone-number');
const serviceDropdown = document.getElementById('service');
const dateInput = document.getElementById('bookingDate');
const timeDropdown = document.getElementById('bookingTime');
const reservationListContainer = document.querySelector('.reservation-list');
const clearButton = document.querySelector('.clear-reservation-btn');

// Initial rendering of reservations on page load
renderReservations();

// Get role (customer/admin)
let role = localStorage.getItem('role');
console.log(`Role: ${role}`);

// Visibility of past reservations
if (role === 'Customer') {
    document.getElementById('past-reservations').style.display = 'none';
} else if (role === 'Admin') {
    document.getElementById('past-reservations').style.display = 'flex';
}

// Event listener for booking a reservation
bookNowButton.addEventListener('click', addReservation);

// Event listener for clearing past reservation
clearButton.addEventListener('click', clearReservations);


let reservationNumber;
// Function to render reservations
function renderReservations() {
    const reservationsRef = ref(db, 'reservations');
    onValue(reservationsRef, (snapshot) => {
        const reservations = snapshot.val();
        let reservationHTML = '';

        if (reservations) {
            Object.values(reservations).forEach((reservation, index) => {
                const name = reservation.name;
                const phoneNumber = reservation.phoneNumber;
                const service = reservation.service;
                const date = reservation.date;
                const time = reservation.time;

                reservationNumber = index + 1;
                let tempHTML = `
                <div class="reservation-content-container">
                    <div class="first-row">
                        <p class="reservation-number"><u>Reservation No.${reservationNumber}</u></p>
                        <p class="name">Name: ${name}</p>
                        <p class="phone-number">Phone Number: ${phoneNumber}</p>
                    </div>
                    <p class="service">Service: ${service}</p>
                    <div class="second-row">
                        <p class="date">Date: ${date}</p>
                        <p class="time">Time: ${time}</p>
                        <br>
                    </div>
                </div>`;

                reservationHTML += tempHTML;
            });
        }
        reservationListContainer.innerHTML = reservationHTML;
    });
}

// Function to add a new reservation
async function addReservation() {
    const name = nameInput.value;
    const phoneNumber = phoneNumberInput.value.trim();
    const service = serviceDropdown.value;
    const date = dateInput.value;
    const time = timeDropdown.value;

    // Validate input fields
    if (!name || !phoneNumber || !service || !date || !time) {
        alert('Please fill in all fields: Name, Phone Number, Service, Date, and Time.');
        return;
    }

    // Combine the date and time from the inputs
    let inputDateTime = new Date(date);
    let timeParts = time.split(':');
    inputDateTime.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);

    // Get the current date and time
    let currentDateTime = new Date();

    // Check if the input date and time are in the past
    if (inputDateTime < currentDateTime) {
        alert('Datetime has passed, please reenter a valid input');
        return;
    }

    // Declare new reservation
    const newReservation = {
        name: name,
        phoneNumber: phoneNumber,
        service: service,
        date: date,
        time: time
    };

    try {
        const reservationsRef = ref(db, 'reservations');
        const newReservationRef = push(reservationsRef);

        // Write new reservation data to Firebase
        await set(newReservationRef, newReservation);

        // Show modal for successful booking
        showModal(newReservation);

        // Clear input fields after successful submission
        nameInput.value = '';
        phoneNumberInput.value = '';
        serviceDropdown.value = '';
        dateInput.value = '';
        timeDropdown.value = '';

        // Re-render reservations to include the new one
        renderReservations();

        console.log('Reservation added to Firebase successfully');
    } catch (error) {
        console.error('Error adding reservation to Firebase:', error);
    }
}

// Function to display modal pop-up with reservation details
function showModal(newReservation) {
    const modal = document.getElementById('reservationModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeBtn = document.querySelector('.close');

    modalMessage.innerHTML = `
    <p><b>Your reservation has been successfully booked!</b></p>
    <p>Name: ${newReservation.name}</p>
    <p>Date: ${newReservation.date}</p>
    <p>Time: ${newReservation.time}</p>
    <p>Service: ${newReservation.service}</p>`;

    modal.style.display = 'flex';

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Function to clear all past reservations from the database
async function clearReservations() {
    console.log("test");
    const reservationsRef = ref(db, 'reservations');

    // Remove all reservations
    try {
        await remove(reservationsRef);
        console.log('Reservations cleared from Firebase successfully');
        renderReservations();
    } catch (error) {
        console.error('Error clearing reservations from Firebase:', error);
    }
}

