import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const buttonElement = document.querySelector('.write-review-btn');
const inputElement = document.querySelector('.review-input');
const reviewerNameElement = document.querySelector('.reviewer-name');
const ratingElement = document.querySelector('.review-rating');
const reviewListContainer = document.querySelector('.review-list');

// Event listeners for write review
buttonElement.addEventListener('click', addReview);

inputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addReview(event);
    }
});

// Call renderReviews initially to load existing reviews
renderReviews();

// Function to render reviews
function renderReviews() {
    const reviewsRef = ref(db, 'reviews');
    onValue(reviewsRef, (snapshot) => {
        const reviews = snapshot.val();
        let reviewHTML = '';

        if (reviews) {
            Object.values(reviews).forEach((reviewObject) => {
                const review = reviewObject.review;
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

                reviewHTML += tempHTML;
            });
        }
        reviewListContainer.innerHTML = reviewHTML;
    });
};

// Functiuon to validate rating input
function validateRating(rating) {
    const parsedRating = Number(rating);
    if (parsedRating >= 1 && parsedRating <= 5) {
        return true; 
    }
    return false; 
}

// Function to get current date in YYYY-MM-DD format
function getCurrentDate() {
    const currentDate = new Date();
    
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}

// Function to add review and write to database
async function addReview(e) {
    e.preventDefault();

    let reviewText = inputElement.value.trim();
    let reviewerName = reviewerNameElement.value.trim();
    let rating = ratingElement.value.trim();

    // Validate empty input
    if (!reviewText || !reviewerName || !rating) {
        alert('Please fill in all fields: Review, Name, and Rating.');
        return;
    }

    // Call validate rating (1-5)
    if (!validateRating(rating)) {
        alert('Please enter a valid rating between 1 and 5.');
        return;
    }
    
    console.log('Button clicked. Trying to write data to Firebase...');

    try {
        // Write user data to Firebase
        const reviewsRef = ref(db, 'reviews');
        const newReviewRef = push(reviewsRef);

        await set(newReviewRef, {
            name: reviewerName,
            rating: rating,
            date: getCurrentDate(),
            review: reviewText
        });

        console.log('Review added successfully');

        // Clear input fields after successful submission
        inputElement.value = '';
        reviewerNameElement.value = '';
        ratingElement.value = '';

        // Re-render reviews to include the new one
        renderReviews();
    } catch (error) {
        console.error('Error adding review:', error);
    }
}