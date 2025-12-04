const averageRating = 4.72; 
const totalReviews = 102;

const starsContainer = document.querySelector('.stars');
const averageRatingSpan = document.querySelector('.average-rating');
const totalReviewsSpan = document.querySelector('.total-reviews');

averageRatingSpan.innerText = averageRating.toFixed(2);
totalReviewsSpan.innerText = `(${totalReviews})`;

starsContainer.innerHTML = '';
for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(averageRating)) {
        starsContainer.innerHTML += '★'; 
    } else if (i - averageRating < 1) {
        starsContainer.innerHTML += '☆'; 
    } else {
        starsContainer.innerHTML += '☆';
    }
}
