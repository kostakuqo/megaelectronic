const averageRating = 4.72; // exemplu
const totalReviews = 102;

const starsContainer = document.querySelector('.stars');
const averageRatingSpan = document.querySelector('.average-rating');
const totalReviewsSpan = document.querySelector('.total-reviews');

averageRatingSpan.innerText = averageRating.toFixed(2);
totalReviewsSpan.innerText = `(${totalReviews})`;

// Generăm stelele (5 stele total)
starsContainer.innerHTML = '';
for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(averageRating)) {
        starsContainer.innerHTML += '★'; // stea plină
    } else if (i - averageRating < 1) {
        starsContainer.innerHTML += '☆'; // stea jumătate (poți înlocui cu un simbol special dacă vrei)
    } else {
        starsContainer.innerHTML += '☆'; // stea goală
    }
}
