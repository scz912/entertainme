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

let watchlist = new Set();

document.addEventListener("DOMContentLoaded", () => {
    renderTrendingItem(allItems);
});


function applyfilter(filter) {
    let filtered = allItems.filter(item => {
        return (item.type === filter);
    });
    document.querySelectorAll(`.filtercontainer`).forEach(item=>{
        if(item.classList.contains(`${filter}filter`)){
            item.classList.add("active");
        }else{
            item.classList.remove("active");
        }
    })
    const container = document.getElementById("topchartlist");
    container.classList.remove("listready");
    setTimeout(()=>{
        renderTopItem(filtered);
    },250);
}

function renderTrendingItem(items) {
    const container = document.getElementById("trendinglist");

    if (items.length === 0) {
        container.innerHTML = `<p class="text-center text-muted mt-4">Error finding trending charts</p>`;
        return;
    }
    html = ""
    container.innerHTML = `<p>Loading trending charts</p>`;

    items.forEach(item => {
        html+= `
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
    setTimeout(()=>{
        container.classList.add("listready");
    },100)
    // console.log(container)
}

function renderTopItem(items) {
    const container = document.getElementById("topchartlist");
    // container.classList.remove("listready");
    if (items.length === 0) {
        container.innerHTML = `<p class="text-center text-muted mt-4">Error finding top charts</p>`;
        return;
    }
    html = ""
    container.innerHTML = `<p>Loading top charts</p>`;

    items.forEach(item => {
        html+= `
        <div class="col-md-3" id="topitem${item.id}">
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
    setTimeout(()=>{
        container.classList.add("listready");
    },250)
    // console.log(container);
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
    bookmarkholder1 = document.querySelector(`#trendingitem${id}`);
    bookmarkholder2 = document.querySelector(`#topitem${id}`);    
    rendersingleItem(bookmarkholder1,id);
    rendersingleItem(bookmarkholder2,id);
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

applyfilter("movie");