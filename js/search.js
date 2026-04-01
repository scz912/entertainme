// MOCK DATA 
const allItems = [
    {
        id: 1,
        title: "Avengers",
        type: "movie",
        genre: "Action",
        year: 2012,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500"
    },
    {
        id: 2,
        title: "Batman",
        type: "movie",
        genre: "Action",
        year: 2022,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?w=500"
    },
    {
        id: 3,
        title: "The Great Gatsby",
        type: "book",
        genre: "Classic",
        year: 1925,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"
    },
    {
        id: 4,
        title: "Abbey Road",
        type: "music",
        genre: "Rock",
        year: 1969,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500"
    }
];

// STATE 
let filters = {
    search: "",
    type: "all",
    genre: "all",
    year: "all",
    rating: "all"
};

let watchlist = new Set();

document.addEventListener("DOMContentLoaded", () => {
    setupFilters();
    renderItems(allItems);
});

// SETUP FILTER EVENTS
function setupFilters() {
    document.getElementById("searchInput").addEventListener("input", (e) => {
        filters.search = e.target.value.toLowerCase();
        applyFilters();
    });

    document.getElementById("typeFilter").addEventListener("change", (e) => {
        filters.type = e.target.value;
        applyFilters();
    });

    document.getElementById("genreFilter").addEventListener("change", (e) => {
        filters.genre = e.target.value;
        applyFilters();
    });

    document.getElementById("yearFilter").addEventListener("change", (e) => {
        filters.year = e.target.value;
        applyFilters();
    });

    document.getElementById("ratingFilter").addEventListener("change", (e) => {
        filters.rating = e.target.value;
        applyFilters();
    });

    document.getElementById("clearBtn").addEventListener("click", () => {
        filters = { search: "", type: "all", genre: "all", year: "all", rating: "all" };
        document.querySelectorAll("select").forEach(s => s.value = "all");
        document.getElementById("searchInput").value = "";
        applyFilters();
    });
}

// FILTER LOGIC 
function applyFilters() {
    let filtered = allItems.filter(item => {
        return (
            (filters.search === "" || item.title.toLowerCase().includes(filters.search)) &&
            (filters.type === "all" || item.type === filters.type) &&
            (filters.genre === "all" || item.genre === filters.genre) &&
            (filters.year === "all" || item.year.toString() === filters.year) &&
            (filters.rating === "all" || item.rating >= parseFloat(filters.rating))
        );
    });

    renderItems(filtered);
}

// RENDER CARDS
function renderItems(items) {
    const container = document.getElementById("results");
    const count = document.getElementById("resultCount");

    count.innerText = `${items.length} Results`;

    if (items.length === 0) {
        container.innerHTML = `<p class="text-center text-muted mt-4">No results found</p>`;
        return;
    }

    let html = "";

    items.forEach(item => {
        html += `
        <div class="col-md-3" id="trendingitem${item.id}">
            <div class="custom-card">
                <img src="${item.image}" class="card-img">

                <span class="badge-type">${item.type.toUpperCase()}</span>
                <i class="bi ${watchlist.has(item.id) ? "bi-bookmark-check active-bookmark" : "bi-bookmark"
            } bookmark-icon" onclick="toggleBookmark(${item.id})"></i>

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
        `;
    });

    container.innerHTML = html;
}

function rendersingleItem(cardholder,id){
    item = allItems.find(it => it.id === id);
    cardholder.innerHTML = `
        <div class="custom-card">
                <img src="${item.image}" class="card-img">

                <span class="badge-type">${item.type.toUpperCase()}</span>
                <i class="bi ${watchlist.has(id) ? "bi-bookmark-check active-bookmark" : "bi-bookmark"} 
                bookmark-icon" onclick="toggleBookmark(${id})"></i>
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
    `;
}

function toggleBookmark(id) {
    if (watchlist.has(id)) {
        watchlist.delete(id);
    } else {
        watchlist.add(id);
    }
    bookmarkholder = document.getElementById("trendingitem"+id);
    rendersingleItem(bookmarkholder,id);
}

function generateStars(rating) {
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

function viewDetails(id) {
    localStorage.setItem("id", id);
    window.location.href = "review.html";
}