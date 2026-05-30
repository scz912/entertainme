let allItems = [];

let watchlist = new Set();

document.addEventListener("DOMContentLoaded", async () => {
    await loadWatchlist();
    await loadTrendingItems();
    await loadTopItems();
});


async function loadTrendingItems() {
    try {
        const trendingcontainer = document.getElementById("trendinglist");
        const spinner1 = document.getElementById("loadingSpinner1");

        trendingcontainer.classList.remove("listready");
        trendingcontainer.innerHTML = "";

        spinner1.classList.remove("d-none");

        const res = await fetch(`${API_BASE_URL}/items`);
        const data = await res.json();

        if (!res.ok) {
<<<<<<< HEAD
            showToast(data.message || "Failed to load items", "error");
=======
            alert(data.message || "Failed to load items");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
            return;
        }

        allItems = data;

        setTimeout(() => {
            renderTrendingItems(allItems, trendingcontainer);
            spinner1.classList.add("d-none");
        }, 100);

    } catch (err) {
        console.error(err);
        spinner1.classList.add("d-none");

        document.getElementById("trendinglist").innerHTML =
            `<p class="text-center text-danger mt-4">Cannot connect to backend API.</p>`;
    }
}

async function loadTopItems() {
    try {
        const topchartcontainer = document.getElementById("topchartlist");
        const spinner2 = document.getElementById("loadingSpinner2");

        topchartcontainer.classList.remove("listready");
        topchartcontainer.innerHTML = "";

        spinner2.classList.remove("d-none");

        const res = await fetch(`${API_BASE_URL}/items`);
        const data = await res.json();

        if (!res.ok) {
<<<<<<< HEAD
            showToast(data.message || "Failed to load items", "error");
=======
            alert(data.message || "Failed to load items");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
            return;
        }

        allItems = data;

        setTimeout(() => {
            applyfilter("movie");
            spinner2.classList.add("d-none");
        }, 100);

    } catch (err) {
        console.error(err);
        spinner2.classList.add("d-none");

        document.getElementById("topchartlist").innerHTML =
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

function applyfilter(filtertype) {
    const topchartcontainer = document.getElementById("topchartlist");
    topchartcontainer.classList.remove("listready");
    var filtercontainer = document.querySelector(`.${filtertype}filter`);
    filtercontainer.classList.add("active");
    var otherfilters = document.querySelectorAll(`:not(.${filtertype}filter)`);
    otherfilters.forEach(filter => {
        filter.classList.remove("active");
    });
    const filtered = allItems.filter(item => {
        return (item.type === filtertype);
    });

    setTimeout(() => {
        renderTopItems(filtered, topchartcontainer);
    }, 200);
}

function renderTrendingItems(items, container) {

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

function renderTopItems(items, container) {

    let html = "";

    items.forEach(item => {
        const itemId = item._id;

        html += `
        <div class="col-md-3" id="topchartitem${itemId}">
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
<<<<<<< HEAD
            showToast("Please login first to use watchlist.", "warning", 1500);
            setTimeout(() => { window.location.href = "signin.html"; }, 1300);
=======
            alert("Please login first to use watchlist.");
            window.location.href = "signin.html";
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
            return;
        }

        if (watchlist.has(id)) {
            const res = await fetch(`${API_BASE_URL}/watchlist/${id}`, {
                method: "DELETE",
                headers: authHeaders()
            });

            const data = await res.json();

            if (!res.ok) {
<<<<<<< HEAD
                showToast(data.message || "Failed to remove from watchlist", "error");
=======
                alert(data.message || "Failed to remove from watchlist");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
                return;
            }

            watchlist.delete(id);
<<<<<<< HEAD
            showToast("Removed from watchlist", "info", 1800);
=======
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d

        } else {
            const res = await fetch(`${API_BASE_URL}/watchlist`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({ itemId: id })
            });

            const data = await res.json();

            if (!res.ok) {
<<<<<<< HEAD
                showToast(data.message || "Failed to add to watchlist", "error");
=======
                alert(data.message || "Failed to add to watchlist");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
                return;
            }

            watchlist.add(id);
<<<<<<< HEAD
            showToast("Added to watchlist", "success", 1800);
=======
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
        }

        const cardholder1 = document.getElementById("trendingitem" + id);
        const cardholder2 = document.getElementById("topchartitem" + id);

        if (cardholder1) {
            rendersingleItem(cardholder1, id);
            if(cardholder2) {
                rendersingleItem(cardholder2, id);
            }
        } else if (cardholder2) {
            rendersingleItem(cardholder2, id);
            if(cardholder1) {
                rendersingleItem(cardholder1, id);
            }
        } else {
            // applyfilter("movie");
        }

    } catch (err) {
        console.error("Bookmark error:", err);
<<<<<<< HEAD
        showToast("Error updating watchlist", "error");
=======
        alert("Error updating watchlist");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
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