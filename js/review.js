let selectedRating = 0;
let currentReviews = [];
let currentItemId = null;


document.addEventListener('DOMContentLoaded', async () => {
    currentItemId = localStorage.getItem("id");
    if (!currentItemId) {
        showToast("No item selected.", "warning");
        return;
    }
    await loadItemDetails(currentItemId);
    await loadReviews(currentItemId);

    setupRatingInput();
    setupFormSubmission();
});

// LOAD ITEM DETAILS
async function loadItemDetails(itemId) {
    try {
        const res = await fetch(`${API_BASE_URL}/items/${itemId}`);
        const data = await res.json();
        if (!res.ok) {
            showToast(data.message || "Unable to load item details.", "error");
            return;
        }
        renderItemDetails(data);
    } catch (err) {
        console.error(err);
        showToast("Unable to connect to the backend. Please make sure the server is running.", "error");
    }
}

// RENDER ITEM DETAILS ON PAGE
function renderItemDetails(item) {
    const starsHtml = generateStars(item.rating || 0);
    const typeLabel = item.type ? item.type.toUpperCase() : "ITEM";
    const html = `
        <div class="col-md-4">
            <img src="${item.image}" alt="${item.title}" class="item-poster">
        </div>
        <div class="col-md-8 d-flex flex-column justify-content-center px-lg-4 mt-4 mt-md-0">
            <div class="mb-2">
                <span class="badge badge-type mb-3">${typeLabel}</span>
                <h1 class="mb-2 fw-bold" style="font-size: 2.2rem;">${item.title}</h1>
                <p class="text-muted mb-4">
                    ${item.year || ""}
                    &nbsp;&middot;&nbsp;
                    ${item.genre || ""}
                    &nbsp;&middot;&nbsp;
                    <i class="bi ${item.type === "Book" ? "bi-book" : item.type === "Music" ? "bi-music-note-beamed" : "bi-clock"}"></i>
                    ${item.length || ""}
                </p>

                <p class="text-light mb-4 lh-lg">
                    ${item.description || ""}
                </p>

                <div class="d-flex align-items-center gap-2 star-rating">
                    ${starsHtml}
                    <span class="text-light ms-2 fw-bold">${Number(item.rating || 0).toFixed(1)}</span>
                    <span class="text-muted ms-1">(${item.totalReviews || 0} reviews)</span>
                </div>
            </div>
        </div>
    `;
    document.getElementById('item-details').innerHTML = html;

    document.getElementById('average-rating-display').innerHTML = `
        <span class="h4 mb-0 text-warning">${Number(item.rating || 0).toFixed(1)}</span>
        <div class="star-rating">${starsHtml}</div>
    `;
}

// LOAD REVIEWS FROM BACKEND
async function loadReviews(itemId) {
    try {
        const res = await fetch(`${API_BASE_URL}/reviews/item/${itemId}`);
        const data = await res.json();

        console.log("Reviews API response:", data);

        if (!res.ok || !Array.isArray(data)) {
            currentReviews = [];
            renderReviews();
            return;
        }

        currentReviews = data.map(review => {
            let reviewDate = "No date";

            if (review.createdAt) {
                const dateObj = new Date(review.createdAt);
                if (!isNaN(dateObj.getTime())) {
                    reviewDate = dateObj.toISOString().split("T")[0];
                }
            }

            return {
                user: review.userId?.name || "Unknown User",
                rating: review.rating || 0,
                date: reviewDate,
                text: review.comment || ""
            };
        });

        renderReviews();

    } catch (err) {
        console.error(err);
        showToast("Unable to load reviews. Please check the review data format.", "error");
    }
}
// RENDER REVIEWS ON PAGE

function renderReviews() {
    const container = document.getElementById('reviews-list');
    if (currentReviews.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-4">No reviews yet. Be the first to review!</p>';
        return;
    }

    let html = '';
    currentReviews.forEach(review => {
        html += `
            <div class="review-item">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="fw-bold text-light">${review.user}</div>
                    <div class="review-meta">${review.date}</div>
                </div>
                <div class="star-rating mb-2">
                    ${generateStars(review.rating)}
                </div>
                <p class="text-muted mb-0">${review.text}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

// GENERATE STAR ICONS BASED ON RATING
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
// STAR RATING INPUT

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
    // Change star icons based on selected rating

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
        // Show selected rating number

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
// SUBMIT REVIEW TO BACKEND

function setupFormSubmission() {
    const form = document.getElementById('review-form');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (selectedRating == 0) {
            showToast("Please select a rating before submitting.", "warning");
            return;
        }

        const comment = document.getElementById("review-text").value;

        if (comment.trim() === "") {
            showToast("Please write a review before submitting.", "warning");
            return;
        }
        const token = localStorage.getItem("token");

        if (!token) {
            showToast("Please login before submitting a review.", "warning", 1500);
            setTimeout(() => { window.location.href = "signin.html"; }, 1300);
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemId: currentItemId,
                    rating: parseFloat(selectedRating),
                    comment: comment
                })
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Failed to submit review.", "error");
                return;
            }

            showToast("Review added successfully!", "success");

            resetReviewForm();

            // Reload reviews from MongoDB after submit
            await loadReviews(currentItemId);

            // Reload item details to update average rating
            await loadItemDetails(currentItemId);

        } catch (error) {
            console.error("Error submitting review:", error);
            showToast("Something went wrong while submitting review.", "error");
        }
    });
}
// RESET FORM AFTER SUBMIT
function resetReviewForm() {
    const form = document.getElementById("review-form");
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

}   
