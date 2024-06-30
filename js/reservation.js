// Get role (customer/admin)
role = localStorage.getItem('role');
console.log(`Role: ${role}`);

// Visibility of past reservations
if (role === 'Customer') {
    document.getElementById('past-reservations').style.display = 'none';
} else if (role === 'Admin') {
    document.getElementById('past-reservations').style.display = 'flex';
}

let reservationList = JSON.parse(localStorage.getItem('reservations')) || [];

const bookNowButton = document.querySelector('.reservation-book-now-btn');
const nameInput = document.getElementById('reservation-name');
const phoneNumberInput = document.getElementById('reservation-phone-number');
const serviceDropdown = document.getElementById('service');
const dateInput = document.getElementById('bookingDate');
const timeDropdown = document.getElementById('bookingTime');
const reservationListContainer = document.querySelector('.reservation-list');
const clearButton = document.querySelector('.clear-reservation-btn');

bookNowButton.addEventListener('click', addReservation);

let reservationNumber;
function renderReservations() {
    let reservationHTML = '';

    reservationList.forEach((reservation, index) => {
        const { name, phoneNumber, service, date, time } = reservation;
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

    reservationListContainer.innerHTML = reservationHTML;
}

function addReservation() {
    const name = nameInput.value.trim();
    const phoneNumber = phoneNumberInput.value.trim();
    const service = serviceDropdown.value;
    const date = dateInput.value;
    const time = timeDropdown.value;

    if (!name || !phoneNumber || !service || !date || !time) {
        alert('Please fill in all fields: Name, Phone Number, Service, Date, and Time.');
        return;
    }

    const newReservation = {
        name,
        phoneNumber,
        service,
        date,
        time
    };

    reservationList.push(newReservation);

    nameInput.value = '';
    phoneNumberInput.value = '';
    serviceDropdown.value = '';
    dateInput.value = '';
    timeDropdown.value = '';

    localStorage.setItem('reservations', JSON.stringify(reservationList));
    renderReservations();
}


function resetLocalStorage() {
    localStorage.removeItem('reservations');
    reservationList = [];
    renderReservations();
}
clearButton.addEventListener('click', resetLocalStorage);

renderReservations();
