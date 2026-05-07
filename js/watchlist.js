// MOCK DATA
const allItems = [
    { id: 1, title: "Avengers", type: "movie", genre: "Action", year: 2012, rating: 4.5, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500" },
    { id: 2, title: "Batman", type: "movie", genre: "Action", year: 2022, rating: 4.2, image: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=500" },
    { id: 3, title: "The Great Gatsby", type: "book", genre: "Classic", year: 1925, rating: 4.7, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500" },
    { id: 4, title: "Abbey Road", type: "music", genre: "Rock", year: 1969, rating: 4.9, image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500" }
];
 
// TRACK BOOKMARKS — start empty
let watchlist = new Set(allItems.map(item => item.id));
let currentFilterType = "all";
 
document.addEventListener("DOMContentLoaded", () => {
    setupFilterTabs(); // called ONCE here only
    renderWatchlist(currentFilterType);
});
 
// RENDER WATCHLIST
function renderWatchlist(filterType = "all") {
    const container = document.getElementById("watchlist-container");
    const count = document.getElementById("watchlist-count");
 
    currentFilterType = filterType;
 
    let items = allItems.filter(item => watchlist.has(item.id));
    if (filterType !== "all") items = items.filter(item => item.type === filterType);
 
    // Update header count
    count.innerText = `${items.length} item${items.length !== 1 ? 's' : ''} saved`;
 
    // Update tab counts
    updateCategoryCount();
 
    // Empty state
    if (items.length === 0) {
        container.innerHTML = `<p class="text-center text-muted mt-4">No items in your watchlist yet</p>`;
        return;
    }
 
    // Render cards
    container.innerHTML = items.map(item => `
        <div class="col-md-3">
            <div class="custom-card">
                <img src="${item.image}" class="card-img">
                <span class="badge-type">${item.type.toUpperCase()}</span>
                <i class="bi bi-bookmark-check active-bookmark bookmark-icon" onclick="toggleBookmark(${item.id})"></i>
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
 
    container.classList.remove("listready");
    setTimeout(() => container.classList.add("listready"), 100);
}
 
// TOGGLE BOOKMARK
function toggleBookmark(id) {
    if (watchlist.has(id)) watchlist.delete(id);
    else watchlist.add(id);
    renderWatchlist(currentFilterType);
}
 
// UPDATE TAB COUNTS ONLY — no event listeners here
function updateCategoryCount() {
    const tabs = document.querySelectorAll(".WL-filtercontainer");
    tabs.forEach(tab => {
        const type = tab.dataset.type;
        const count = allItems.filter(item => watchlist.has(item.id) && (type === "all" || item.type === type)).length;
        const icon = tab.querySelector("i").outerHTML;
        tab.innerHTML = `${icon} ${type.charAt(0).toUpperCase() + type.slice(1)} (${count})`;
    });
}
 
// SETUP FILTER TABS — called ONCE on DOMContentLoaded
function setupFilterTabs() {
    const tabs = document.querySelectorAll(".WL-filtercontainer");
    tabs.forEach(tab => {
        const type = tab.dataset.type;
 
        tab.addEventListener("click", () => {
            document.querySelectorAll(".WL-filtercontainer").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const container = document.getElementById("watchlist-container");
            container.classList.remove("listready");
            setTimeout(() => renderWatchlist(type), 400);
        });
    });
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