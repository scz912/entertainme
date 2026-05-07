let allItems = [];

let filters = {
    search: "",
    type: "all",
    genre: "all",
    year: "all",
    rating: "all"
};

let watchlist = new Set();

document.addEventListener("DOMContentLoaded", async () => {
    setupFilters();
    await loadWatchlist();
    await loadItemsFromAPI();
});

async function loadItemsFromAPI() {
    try {
        const container = document.getElementById("results");
        const spinner = document.getElementById("loadingSpinner");

        container.classList.remove("listready");
        container.innerHTML = "";

        spinner.classList.remove("d-none");

        const res = await fetch(`${API_BASE_URL}/items`);
        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Failed to load items");
            return;
        }

        allItems = data;
        populateFilterOptions(allItems);

        setTimeout(() => {
            renderItems(allItems);
            spinner.classList.add("d-none");
        }, 100);

    } catch (err) {
        console.error(err);
        spinner.classList.add("d-none");

        document.getElementById("results").innerHTML =
            `<p class="text-center text-danger mt-4">Cannot connect to backend API.</p>`;
    }
}

async function loadWatchlist() {
    try {
        const token = getToken();

        if (!token) {
            watchlist = new Set();
            return;
        }

        const res = await fetch(`${API_BASE_URL}/watchlist`, {
            headers: authHeaders()
        });

        const data = await res.json();

        if (!res.ok) {
            watchlist = new Set();
            return;
        }

        watchlist = new Set(
            data
                .filter(w => w.itemId && w.itemId._id)
                .map(w => w.itemId._id)
        );

    } catch (err) {
        console.error("Watchlist load error:", err);
        watchlist = new Set();
    }
}

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
        filters = {
            search: "",
            type: "all",
            genre: "all",
            year: "all",
            rating: "all"
        };

        document.getElementById("searchInput").value = "";
        document.getElementById("typeFilter").value = "all";
        document.getElementById("genreFilter").value = "all";
        document.getElementById("yearFilter").value = "all";
        document.getElementById("ratingFilter").value = "all";

        applyFilters();
    });
}

function populateFilterOptions(items) {
    const genreFilter = document.getElementById("genreFilter");
    const yearFilter = document.getElementById("yearFilter");

    const genres = [...new Set(items.map(item => item.genre).filter(Boolean))];
    const years = [...new Set(items.map(item => item.year).filter(Boolean))].sort((a, b) => b - a);

    genreFilter.innerHTML = `<option value="all">All Genres</option>`;
    genres.forEach(genre => {
        genreFilter.innerHTML += `<option value="${genre}">${genre}</option>`;
    });

    yearFilter.innerHTML = `<option value="all">All Years</option>`;
    years.forEach(year => {
        yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });
}

function applyFilters() {
    const container = document.getElementById("results");
    container.classList.remove("listready");

    const filtered = allItems.filter(item => {
        const title = item.title ? item.title.toLowerCase() : "";
        const genre = item.genre ? item.genre.toLowerCase() : "";

        return (
            (filters.search === "" ||
                title.includes(filters.search) ||
                genre.includes(filters.search)) &&

            (filters.type === "all" || item.type === filters.type) &&

            (filters.genre === "all" || item.genre === filters.genre) &&

            (filters.year === "all" || item.year.toString() === filters.year) &&

            (filters.rating === "all" || Number(item.rating) >= Number(filters.rating))
        );
    });

    setTimeout(() => {
        renderItems(filtered);
    }, 100);
}

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
        const itemId = item._id;

        html += `
        <div class="col-md-3" id="trendingitem${itemId}">
            <div class="custom-card">
                <img src="${item.image || 'https://via.placeholder.com/500'}" class="card-img">

                <span class="badge-type">${item.type.toUpperCase()}</span>

                <i class="bi ${watchlist.has(itemId) ? "bi-bookmark-check active-bookmark" : "bi-bookmark"} 
                   bookmark-icon" onclick="toggleBookmark('${itemId}')"></i>

                <div class="card-body">
                    <h6>${item.title}</h6>

                    <div class="d-flex justify-content-between small text-muted">
                        <span>${item.year}</span>
                        <span>${item.genre}</span>
                    </div>

                    <div class="rating">
                        ${generateStars(Number(item.rating))}
                        <span class="ms-1">${Number(item.rating).toFixed(1)}</span>
                    </div>
                </div>

                <div class="view-overlay">
                    <button onclick="viewDetails('${itemId}')">
                        <i class="bi bi-play-fill"></i> View Details
                    </button>
                </div>
            </div>
        </div>
        `;
    });

    container.innerHTML = html;

    setTimeout(() => {
        container.classList.add("listready");
    }, 100);
}

function rendersingleItem(cardholder, id) {
    const item = allItems.find(it => it._id === id);

    if (!item) return;

    cardholder.innerHTML = `
        <div class="custom-card">
            <img src="${item.image || 'https://via.placeholder.com/500'}" class="card-img">

            <span class="badge-type">${item.type.toUpperCase()}</span>

            <i class="bi ${watchlist.has(id) ? "bi-bookmark-check active-bookmark" : "bi-bookmark"} 
               bookmark-icon" onclick="toggleBookmark('${id}')"></i>

            <div class="card-body">
                <h6>${item.title}</h6>

                <div class="d-flex justify-content-between small text-muted">
                    <span>${item.year}</span>
                    <span>${item.genre}</span>
                </div>

                <div class="rating">
                    ${generateStars(Number(item.rating))}
                    <span class="ms-1">${Number(item.rating).toFixed(1)}</span>
                </div>
            </div>

            <div class="view-overlay">
                <button onclick="viewDetails('${id}')">
                    <i class="bi bi-play-fill"></i> View Details
                </button>
            </div>
        </div>
    `;
}

async function toggleBookmark(id) {
    try {
        const token = getToken();

        if (!token) {
            alert("Please login first to use watchlist.");
            window.location.href = "login.html";
            return;
        }

        if (watchlist.has(id)) {
            const res = await fetch(`${API_BASE_URL}/watchlist/${id}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to remove from watchlist");
                return;
            }

            watchlist.delete(id);

        } else {
            const res = await fetch(`${API_BASE_URL}/watchlist`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ itemId: id })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to add to watchlist");
                return;
            }

            watchlist.add(id);
        }

        const cardholder = document.getElementById("trendingitem" + id);

        if (cardholder) {
            rendersingleItem(cardholder, id);
        } else {
            applyFilters();
        }

    } catch (err) {
        console.error("Bookmark error:", err);
        alert("Error updating watchlist");
    }
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