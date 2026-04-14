// MOCK DATA
const allItems = [
    { id: 1, title: "Avengers", type: "movie", genre: "Action", year: 2012, rating: 4.5, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500" },
    { id: 2, title: "Batman", type: "movie", genre: "Action", year: 2022, rating: 4.2, image: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=500" },
    { id: 3, title: "The Great Gatsby", type: "book", genre: "Classic", year: 1925, rating: 4.7, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500" },
    { id: 4, title: "Abbey Road", type: "music", genre: "Rock", year: 1969, rating: 4.9, image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500" }
];

// TRACK BOOKMARKS
let watchlist = new Set(allItems.map(item => item.id)); // all items "bookmarked" initially
let currentFilterType = "all"; // Default to "all" when the page loads


document.addEventListener("DOMContentLoaded", () => {
    renderWatchlist(currentFilterType); // Show all items by default
});

// RENDER WATCHLIST
function renderWatchlist(filterType = "all") {
    const container = document.getElementById("watchlist-container");
    const count = document.getElementById("watchlist-count");

    // Set the current filter type globally
    currentFilterType = filterType;

    // Filter items based on the current filter type
    let items = allItems.filter(item => watchlist.has(item.id)); // Only include bookmarked items
    
    // Apply the filter
    if (filterType !== "all") items = items.filter(item => item.type === filterType);

    // Update the count of saved items
    count.innerText = `${items.length} item${items.length !== 1 ? 's' : ''} saved`;

    // If no items to show
    if (items.length === 0) {
        container.innerHTML = `<p class="text-center text-muted mt-4">No items in your watchlist yet</p>`;
        return;
    }

    // Render the list of items (only the bookmarked ones)
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

    // Call the function to update category counts
    updateCategoryCount(filterType);

    // SETUP FILTER TABS - Update tabs and counts
    setupFilterTabs(filterType);
}


// TOGGLE BOOKMARK
function toggleBookmark(id) {
    if (watchlist.has(id)) watchlist.delete(id);
    else watchlist.add(id);
    renderWatchlist(currentFilterType); // Refresh view
    updateCategoryCount(currentFilterType); // Update the category counts
}

// FUNCTION TO UPDATE CATEGORY COUNT
function updateCategoryCount(filterType) {
    const tabs = document.querySelectorAll(".WL-filtercontainer");
    
    tabs.forEach(tab => {
        const type = tab.dataset.type;
        const filteredItems = allItems.filter(item => watchlist.has(item.id) && (type === "all" || item.type === type));
        const tabCount = filteredItems.length;
        const icon = tab.querySelector("i").outerHTML;

        // Update tab content with the count
        tab.innerHTML = `${icon} ${type.charAt(0).toUpperCase() + type.slice(1)} (${tabCount})`;
    });
}

// FILTER TAB EVENTS
function setupFilterTabs(selectedFilterType = "all") {
    const tabs = document.querySelectorAll(".WL-filtercontainer");

    tabs.forEach(tab => {
        const type = tab.dataset.type;
        const filteredItems = allItems.filter(item => watchlist.has(item.id) && (type === "all" || item.type === type));
        const tabCount = filteredItems.length;
        const icon = tab.querySelector("i").outerHTML;

        // Update tab content with the count
        tab.innerHTML = `${icon} ${type.charAt(0).toUpperCase() + type.slice(1)} (${tabCount})`;

        // Add event listener to filter by type
        tab.addEventListener("click", () => {
            // Update active class
            document.querySelectorAll(".WL-filtercontainer").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Re-render the watchlist based on the selected filter
            renderWatchlist(type); // Pass the selected filter type to renderWatchlist
        });

        // Set the active class based on the filterType argument
        if (type === selectedFilterType) {
            tab.classList.add("active");
        }
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