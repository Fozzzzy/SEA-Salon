let reservationList =  JSON.parse(localStorage.getItem('reservations')) || [];

const buttonElement = document.querySelector('.reservation-book-now-btn');
const reservationName = document.querySelector('.reservation-name').value;
const reservationPhone = document.querySelector('.reservation-phone-number').value;
const selectedService = document.querySelector('.service-dropdown').value;
const selectedDate = document.querySelector('.booking-date').value;
const selectedTime = document.querySelector('.booking-time-dropdown').value;


buttonElement.addEventListener('click', addReservation);

jnmrenderReservation();

function renderReservation() {
    let reservationHTML = '';

    reservationList.forEach((reviewObject) => {
        const reservation = reservationObject.reser;
        const reviewerName = reviewObject.name;
        const rating = reviewObject.rating;
        const date = reviewObject.date;

        let tempHTML = `
        <div class="review-content-container">
            <div class="first-row">
                <p class="name">${reviewerName},</p>
                <p class="currDate">${date}</p>
            </div>
            <p class="rating">${rating} / 5 &#x2B50;&#xFE0F;</p>
            <div class="second-row">
                <p class="review-content">${review}</p>
            </div>
        </div>`;

        reservationHTML += tempHTML;
    });

    reservationListContainer.innerHTML = reservationHTML;
}

function addReview() {
    let reviewText = inputElement.value.trim();
    let reviewerName = reviewerNameElement.value.trim();
    let rating = ratingElement.value.trim();

    if (!reviewText || !reviewerName || !rating) {
        alert('Please fill in all fields: Review, Name, and Rating.');
        return;
    }

    if (!validateRating(rating)) {
        alert('Please enter a valid rating between 1 and 5.');
        return;
    }

    const newReview = {
        name: reviewerName,
        rating: rating,
        date: getCurrentDate(),
        review: reviewText
    };

    reservationList.push(newReview);

    inputElement.value = '';
    reviewerNameElement.value = '';
    ratingElement.value = '';

    localStorage.setItem('reviews', JSON.stringify(reservationList));
    renderReservation();
}

function getCurrentDate() {
    const currentDate = new Date();
    
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}

function validateRating(rating) {
    const parsedRating = Number(rating);

    if (parsedRating >= 1 && parsedRating <= 5) {
        return true; 
    }
    return false; 
}

inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addReview();
    }
});



//FUNCTION TO RESET FROM ADMIN
function resetLocalStorage() {
    localStorage.removeItem('reviews');
    reservationList = []; 
    renderReservation(); 
}

// resetLocalStorage()