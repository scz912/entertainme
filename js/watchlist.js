// MOCK DATA
const allItems = [
    { id: 1, title: "Avengers", type: "movie", genre: "Action", year: 2012, rating: 4.5, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500" },
    { id: 2, title: "Batman", type: "movie", genre: "Action", year: 2022, rating: 4.2, image: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=500" },
    { id: 3, title: "The Great Gatsby", type: "book", genre: "Classic", year: 1925, rating: 4.7, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500" },
    { id: 4, title: "Abbey Road", type: "music", genre: "Rock", year: 1969, rating: 4.9, image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500" }
];

// TRACK BOOKMARKS
let watchlist = new Set(allItems.map(item => item.id)); // all items "bookmarked" initially

document.addEventListener("DOMContentLoaded", () => {
    renderWatchlist();
    setupFilterTabs();
});

// RENDER WATCHLIST
function renderWatchlist(filterType = "all") {
    const container = document.getElementById("watchlist-container");
    const count = document.getElementById("watchlist-count");

    let items = allItems;
    

    if (filterType !== "all") items = items.filter(item => item.type === filterType);

    const tabs = document.querySelectorAll(".WL-filtercontainer");
tabs.forEach(tab => {
    const type = tab.dataset.type; 
    const tabCount = type === "all" 
        ? allItems.length 
        : allItems.filter(i => i.type === type).length;
    const icon = tab.querySelector("i").outerHTML;
    tab.innerHTML = `${icon} ${type.charAt(0).toUpperCase() + type.slice(1)} (${tabCount})`;
});


    count.innerText = `${items.length} item${items.length !== 1 ? 's' : ''} saved`;

    if (items.length === 0) {
        container.innerHTML = `<p class="text-center text-muted mt-4">No items in your watchlist yet</p>`;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="col-md-3">
            <div class="custom-card">
                <img src="${item.image}" class="card-img">
                <span class="badge-type">${item.type.toUpperCase()}</span>
                <i class="bi ${watchlist.has(item.id) ? "bi-bookmark-check active-bookmark" : "bi-bookmark"} bookmark-icon" onclick="toggleBookmark(${item.id})"></i>
                <div class="card-body">
                    <h6>${item.title}</h6>
                    <div class="d-flex justify-content-between small text-muted">
                        <span>${item.year}</span>
                        <span>${item.genre}</span>
                    </div>
                    <div class="rating">
                        ${generateStars(item.rating)}
                        <span class="ms-1">${item.rating}</span>
                    </div>
                </div>
                <div class="view-overlay">
                    <button onclick="viewDetails(${item.id})">
                        <i class="bi bi-play-fill"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// TOGGLE BOOKMARK
function toggleBookmark(id) {
    if (watchlist.has(id)) watchlist.delete(id);
    else watchlist.add(id);
    renderWatchlist(); // refresh view
}

// GENERATE STAR RATING
function generateStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) stars += '<i class="bi bi-star-fill filled"></i>';
        else if (i - 0.5 <= rating) stars += '<i class="bi bi-star-half filled"></i>';
        else stars += '<i class="bi bi-star"></i>';
    }
    return stars;
}

// VIEW DETAILS
function viewDetails(id) {
    localStorage.setItem("id", id);
    window.location.href = "review.html";
}

// FILTER TAB EVENTS
function setupFilterTabs() {
    document.querySelectorAll(".WL-filtercontainer").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".WL-filtercontainer").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const filterType = tab.dataset.type; // get which tab was clicked
            renderWatchlist(filterType);          // render only that category
        });
    });
}