let reviewList =  JSON.parse(localStorage.getItem('reviews')) || [];

const buttonElement = document.querySelector('.write-review-btn');
const inputElement = document.querySelector('.review-input');
const reviewerNameElement = document.querySelector('.reviewer-name');
const ratingElement = document.querySelector('.review-rating');
const reviewListContainer = document.querySelector('.review-list');

buttonElement.addEventListener('click', addReview);

renderReview();

function renderReview() {
    let reviewHTML = '';

    reviewList.forEach((reviewObject) => {
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

    reviewListContainer.innerHTML = reviewHTML;
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

    reviewList.push(newReview);

    inputElement.value = '';
    reviewerNameElement.value = '';
    ratingElement.value = '';

    localStorage.setItem('reviews', JSON.stringify(reviewList));
    renderReview();
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
    reviewList = []; 
    renderReview(); 
}

// resetLocalStorage()