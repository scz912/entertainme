// Store watchlist items from MongoDB
let watchlistItems = [];
let currentFilterType = "all";

document.addEventListener("DOMContentLoaded", () => {
    setupFilterTabs();
    loadWatchlist();
});

// LOAD WATCHLIST FROM BACKEND / MONGODB
async function loadWatchlist() {
    const token = getToken();

    if (!token) {
        alert("Please login first");
        window.location.href = "signin.html";
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/watchlist`, {
            method: "GET",
            headers: authHeaders()
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Failed to load watchlist");
            return;
        }

        
        watchlistItems = data
            .map(w => w.itemId)
            .filter(item => item !== null && item !== undefined);

        renderWatchlist(currentFilterType);

    } catch (error) {
        console.error("Error loading watchlist:", error);
        alert("Cannot connect to backend");
    }
}

// RENDER WATCHLIST
function renderWatchlist(filterType = "all") {
    const container = document.getElementById("watchlist-container");
    const count = document.getElementById("watchlist-count");

    currentFilterType = filterType;

    let items = watchlistItems;

    if (filterType !== "all") {
        items = items.filter(item => item.type === filterType);
    }

    count.innerText = `${items.length} item${items.length !== 1 ? "s" : ""} saved`;

    updateCategoryCount();

    if (items.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <p class="text-center text-muted mt-4">
                    No items in your watchlist yet
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => {
        const image = item.image || item.poster || item.coverImage || "img/homebannerbg.jpg";
        const rating = Number(item.rating) || 0;

        return `
            <div class="col-md-3">
                <div class="custom-card">
                    <img src="${image}" class="card-img">

                    <span class="badge-type">${(item.type || "item").toUpperCase()}</span>

                    <i class="bi bi-bookmark-check active-bookmark bookmark-icon"
                       onclick="removeFromWatchlist('${item._id}')"></i>

                    <div class="card-body">
                        <h6>${item.title || "Untitled"}</h6>

                        <div class="d-flex justify-content-between small text-muted">
                            <span>${item.year || "-"}</span>
                            <span>${item.genre || "-"}</span>
                        </div>

                        <div class="rating">
                            ${generateStars(rating)}
                            <span class="ms-1">${rating.toFixed(1)}</span>
                        </div>
                    </div>

                    <div class="view-overlay">
                        <button onclick="viewDetails('${item._id}')">
                            <i class="bi bi-play-fill"></i> View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    container.classList.remove("listready");
    setTimeout(() => container.classList.add("listready"), 100);
}

// REMOVE FROM WATCHLIST IN BACKEND / MONGODB
async function removeFromWatchlist(itemId) {
    try {
        const res = await fetch(`${API_BASE_URL}/watchlist/${itemId}`, {
            method: "DELETE",
            headers: authHeaders()
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Failed to remove item");
            return;
        }

        alert(data.message || "Removed from watchlist");

        // Reload latest data from MongoDB
        loadWatchlist();

    } catch (error) {
        console.error("Error removing from watchlist:", error);
        alert("Cannot connect to backend");
    }
}

// UPDATE TAB COUNTS
function updateCategoryCount() {
    const tabs = document.querySelectorAll(".WL-filtercontainer");

    tabs.forEach(tab => {
        const type = tab.dataset.type;

        const total = watchlistItems.filter(item => {
            return type === "all" || item.type === type;
        }).length;

        const icon = tab.querySelector("i") ? tab.querySelector("i").outerHTML : "";

        let label = "All";
        if (type === "movie") label = "Movies";
        if (type === "music") label = "Music";
        if (type === "book") label = "Books";

        tab.innerHTML = `${icon} ${label} (${total})`;
    });
}

// SETUP FILTER TABS
function setupFilterTabs() {
    const tabs = document.querySelectorAll(".WL-filtercontainer");

    tabs.forEach(tab => {
        const type = tab.dataset.type;

        tab.addEventListener("click", () => {
            document.querySelectorAll(".WL-filtercontainer")
                .forEach(t => t.classList.remove("active"));

            tab.classList.add("active");

            const container = document.getElementById("watchlist-container");
            container.classList.remove("listready");

            setTimeout(() => renderWatchlist(type), 400);
        });
    });
}

// GENERATE STAR RATING
function generateStars(rating) {
    rating = Number(rating) || 0;

    let stars = "";

    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="bi bi-star-fill filled"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="bi bi-star-half filled"></i>';
        } else {
            stars += '<i class="bi bi-star"></i>';
        }
    }

    return stars;
}

// VIEW DETAILS
function viewDetails(id) {
    localStorage.setItem("id", id);
    window.location.href = `review.html?id=${id}`;
}