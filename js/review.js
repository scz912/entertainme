const mockData = {
    1: { id: 1, title: 'Avengers', type: 'Movie', genre: 'Action', year: '2012', image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&q=80', description: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.', rating: 4.5, totalReviews: 1205 },
    2: { id: 2, title: 'Batman', type: 'Movie', genre: 'Romance', year: '2022', image: 'https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=500&q=80', description: 'When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.', rating: 4.2, totalReviews: 854 }
};
// Store current reviews (this acts like your database for now)
let currentReviews = [
    { user: 'Alice119', rating: 5, date: '2025-10-15', text: 'Absolutely spectacular. The action sequences are mind-blowing.' },
    { user: 'CriticJoe', rating: 4, date: '2024-09-22', text: 'Great entertainment, though the pacing in the middle was a bit slow.' },
    { user: 'CasualViewer', rating: 3, date: '2023-08-10', text: 'It was okay. A bit too long for my taste.' }
];

let selectedRating = 0;

document.addEventListener('DOMContentLoaded', () => {
    let itemId = localStorage.getItem('id');
    if (!itemId || !mockData[itemId]) itemId = 1;
    const item = mockData[itemId];

    renderItemDetails(item);
    renderReviews();
    setupRatingInput();
    setupFormSubmission();
});

function renderItemDetails(item) {
    const starsHtml = generateStars(item.rating);
    const typeLabel = item.type ? item.type.toUpperCase() : 'MOVIE';
    const html = `
        <div class="col-md-4">
            <img src="${item.image}" alt="${item.title}" class="item-poster">
        </div>
        <div class="col-md-8 d-flex flex-column justify-content-center px-lg-4 mt-4 mt-md-0">
            <div class="mb-2">
                <span class="badge badge-type mb-3">${typeLabel}</span>
                <h1 class="mb-2 fw-bold" style="font-size: 2.2rem;">${item.title}</h1>
                <p class="text-muted mb-4">${item.year} &nbsp;&middot;&nbsp; ${item.genre}</p>
                <p class="text-light mb-4 lh-lg">${item.description}</p>
                <div class="d-flex align-items-center gap-2 star-rating">
                    ${starsHtml}
                    <span class="text-light ms-2 fw-bold">${item.rating}</span>
                    <span class="text-muted ms-1">(${item.totalReviews} reviews)</span>
                </div>
            </div>
        </div>
    `;
    document.getElementById('item-details').innerHTML = html;

    document.getElementById('average-rating-display').innerHTML = `
        <span class="h4 mb-0 text-warning">${item.rating}</span>
        <div class="star-rating">${starsHtml}</div>
    `;
}

function renderReviews() {
    const container = document.getElementById('reviews-list');
    if (currentReviews.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No reviews yet. Be the first to review!</p>';
        return;
    }

    let html = '';
    currentReviews.forEach(r => {
        html += `
            <div class="review-item">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="fw-bold text-light">${r.user}</div>
                    <div class="review-meta">${r.date}</div>
                </div>
                <div class="star-rating mb-2">
                    ${generateStars(r.rating)}
                </div>
                <p class="text-muted mb-0">${r.text}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            // Full star
            stars += '<i class="bi bi-star-fill"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            //half star
            stars += '<i class="bi bi-star-half"></i>';
        } else {
            //empty star
            stars += '<i class="bi bi-star"></i>';
        }
    }
    return stars;
}

function setupRatingInput() {
    const stars = document.querySelectorAll('#review-star-input i');
    const input = document.getElementById('rating-value');
    const display = document.getElementById('rating-display');


    stars.forEach(star => {
        star.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const isHalf = x < rect.width / 2;
            const baseVal = parseFloat(this.getAttribute('data-rating'));
            const val = isHalf ? baseVal - 0.5 : baseVal;
            highlightStars(val);
        });

        star.addEventListener('mouseout', function () {
            highlightStars(selectedRating);
        });

        star.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const isHalf = x < rect.width / 2;
            const baseVal = parseFloat(this.getAttribute('data-rating'));
            selectedRating = isHalf ? baseVal - 0.5 : baseVal;
            input.value = selectedRating;
            highlightStars(selectedRating);
        });
    });

    function highlightStars(val) {
        stars.forEach(s => {
            const starVal = parseFloat(s.getAttribute('data-rating'));
            s.classList.remove('bi-star', 'bi-star-half', 'bi-star-fill', 'active');
            
            if (starVal <= val) {
                s.classList.add('bi-star-fill', 'active');
            } else if (starVal - 0.5 === val) {
                s.classList.add('bi-star-half', 'active');
            } else {
                s.classList.add('bi-star');
            }
        });
    
        if (display) {
            if (val > 0) {
                display.textContent = val.toFixed(1);
                display.style.display = 'block';
            } else {
                display.style.display = 'none';
            }
        }
    }
}

function setupFormSubmission() {
    const form = document.getElementById('review-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (selectedRating == 0) {
            alert('Please select a rating before submitting.');
            return;
        }

        const text = document.getElementById('review-text').value;
        const date = new Date().toISOString().split('T')[0];

        currentReviews.unshift({
            user: 'You',
            rating: parseFloat(selectedRating),
            date: date,
            text: text
        });

        form.reset();
        selectedRating = 0;
        document.getElementById('rating-value').value = 0;
        const display = document.getElementById('rating-display');
        if (display) display.style.display = 'none';
        const stars = document.querySelectorAll('#review-star-input i');
        stars.forEach(s => {
            s.classList.remove('bi-star-fill', 'bi-star-half', 'active');
            s.classList.add('bi-star');
        });

        renderReviews();
    });
}