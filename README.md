# 🎬 EntertainMe

EntertainMe is a web-based entertainment recommendation system that allows users to explore movies, books, and music. Users can register, login, search entertainment items, save items into watchlist, manage profile, and submit ratings and reviews.

---

## 📌 Project Objective

The objective of this project is to create a web application that helps users discover entertainment content such as movies, books, and music. The system also allows users to save favourite items, manage their profile, and share reviews.

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript

### Backend
- Node.js (Express.js)

### Database
- MongoDB Atlas

---

## 📁 Project Structure

```txt
ENTERTAINME/
│
├── .vscode/
│
├── css/
│   └── style.css
│
├── entertainme-backend/
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Item.js
│   │   ├── Review.js
│   │   ├── User.js
│   │   └── Watchlist.js
│   │
│   ├── node_modules/
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── userRoutes.js
│   │   └── watchlistRoutes.js
│   │
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── img/
│   └── homebannerbg.jpg
│
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── main.js
│   ├── profile.js
│   ├── review.js
│   ├── search.js
│   └── watchlist.js
│
├── changePassword.html
├── editProfile.html
├── emailVerification.html
├── home.html
├── login.html
├── otp.html
├── profile.html
├── review.html
├── search.html
├── signup.html
└── watchlist.html
```

---

## 📂 File Functions

### Frontend Files

| File | Function |
|---|---|
| `login.html` | Login page interface |
| `signup.html` | User registration page interface |
| `home.html` | Homepage / dashboard showing trending and top chart entertainment |
| `search.html` | Search and filter page for movies, music, and books |
| `watchlist.html` | Displays user saved entertainment items |
| `profile.html` | Displays user profile and profile management options |
| `editProfile.html` | Allows user to edit profile information |
| `changePassword.html` | Allows user to update password |
| `emailVerification.html` | Email verification page for password reset |
| `otp.html` | OTP verification page |
| `review.html` | Displays item details and allows user to submit reviews |
| `css/style.css` | Main styling file for all pages |
| `img/homebannerbg.jpg` | Homepage banner background image |

---

### Frontend JavaScript Files

| File | Function |
|---|---|
| `js/api.js` | Stores API base URL and authentication header function |
| `js/auth.js` | Handles login, register, and logout API logic |
| `js/main.js` | Handles homepage logic and common UI functions |
| `js/search.js` | Fetches entertainment items from API and handles search/filter |
| `js/review.js` | Handles review page, rating input, and review API integration |
| `js/watchlist.js` | Handles add, remove, and display watchlist using API |
| `js/profile.js` | Handles profile API integration such as view profile and update profile |

---

### Backend Files

| File | Function |
|---|---|
| `server.js` | Main backend server file |
| `.env` | Stores secret configuration such as MongoDB URL and JWT secret |
| `package.json` | Stores backend dependencies and scripts |
| `middleware/authMiddleware.js` | Verifies JWT token for protected routes |
| `models/User.js` | User database schema |
| `models/Item.js` | Entertainment item database schema |
| `models/Review.js` | Review database schema |
| `models/Watchlist.js` | Watchlist database schema |
| `routes/authRoutes.js` | Register and login API routes |
| `routes/userRoutes.js` | Profile, update profile, change password, delete account routes |
| `routes/itemRoutes.js` | Entertainment item API routes |
| `routes/reviewRoutes.js` | Review and rating API routes |
| `routes/watchlistRoutes.js` | Watchlist API routes |

---

## ⚙️ Backend Setup

### 1. Go to backend folder

```bash
cd entertainme-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 4. Run backend server

```bash
npm run dev
```

Expected output:

```txt
Server running on port 5000
MongoDB connected
```

---

## 🗄️ MongoDB Compass Setup

Team members can use MongoDB Compass to access and view the project database locally.

### Steps

1. Download and install MongoDB Compass:

```txt
https://www.mongodb.com/products/tools/compass
```

2. Open MongoDB Compass.

3. Click:

```txt
Add new connection
```

4. Paste this MongoDB connection string:

```txt
mongodb+srv://aisoh912_db_user:wif2003entertainme@entertainme.4xc3jwv.mongodb.net/entertainmeDB?retryWrites=true&w=majority&appName=entertainme
```

5. Click:

```txt
Save & Connect
```

6. Open database:

```txt
entertainmeDB
```

7. Main collections:

```txt
users
items
reviews
watchlists
```

### MongoDB Rules

- Do not delete collections.
- Do not randomly modify database data.
- Use Postman or frontend API for testing.
- Ask the leader before changing database structure.

---

## 🌐 Frontend Setup

Open frontend using **Live Server** in VS Code. (You all maybe can download extension of Live Server)

Recommended starting page:

```txt
login.html
```

Frontend URL example:

```txt
http://127.0.0.1:5500/login.html
```

Backend API URL:

```txt
http://localhost:5000/api
```

---

## 🔗 API Base Setup

File: `js/api.js`

```js
const API_BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  };
}
```

---

## 🔐 Authentication API

### Register (routes/authRoutes.js)

```http
POST /api/auth/register
```

Request body:

```json
{
  "name": "Soh Chang Zheng",
  "email": "example@gmail.com",
  "password": "12345678"
}
```

---

### Login (routes/authRoutes.js)

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "example@gmail.com",
  "password": "12345678"
}
```

After login, save token:

```js
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));
```

---

### Logout

```js
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
```

---

## 👤 User Profile API

### View Profile (routes/userRoutes.js)

```http
GET /api/users/profile
```

Headers:

```txt
Authorization: Bearer token_here
```

---

### Update Profile (routes/userRoutes.js)

```http
PUT /api/users/profile
```

Request body:

```json
{
  "name": "New Name",
  "email": "newemail@gmail.com"
}
```

---

### Change Password (routes/userRoutes.js)

```http
PUT /api/users/change-password
```

Request body:

```json
{
  "oldPassword": "12345678",
  "newPassword": "newpassword123"
}
```

---

### Delete Account (routes/userRoutes.js)

```http
DELETE /api/users/profile
```

---

## 🎞️ Items API

### Get All Items (routes/itemRoutes.js)

```http
GET /api/items
```

Used by:
- `home.html`
- `search.html`
- `review.html`

---

### Get Single Item (routes/itemRoutes.js)

```http
GET /api/items/:id
```

Example:

```txt
http://localhost:5000/api/items/ITEM_ID_HERE
```

---

## 🔍 Search API Integration

Frontend should call:

```js
const res = await fetch(`${API_BASE_URL}/items`);
const data = await res.json();
```

Then filtering can be done in frontend JavaScript using:
- title
- type
- genre
- year
- rating

---

## ⭐ Review API

### Add Review (routes/reviewRoutes.js)

```http
POST /api/reviews
```

Headers:

```txt
Authorization: Bearer token_here
Content-Type: application/json
```

Request body:

```json
{
  "itemId": "ITEM_ID_HERE",
  "rating": 5,
  "comment": "Very good movie!"
}
```

---

### Get Reviews by Item (routes/reviewRoutes.js)

```http
GET /api/reviews/item/:itemId
```

---

### Get My Reviews (routes/reviewRoutes.js)

```http
GET /api/reviews/my-reviews
```

Headers:

```txt
Authorization: Bearer token_here
```

---

## 📌 Watchlist API

### Add to Watchlist (routes/watchlistRoutes.js)

```http
POST /api/watchlist
```

Request body:

```json
{
  "itemId": "ITEM_ID_HERE"
}
```

---

### View My Watchlist (routes/watchlistRoutes.js)

```http
GET /api/watchlist
```

---

### Remove from Watchlist (routes/watchlistRoutes.js)

```http
DELETE /api/watchlist/:itemId
```

---

## 🔗 Frontend API Integration Examples

This section shows how to connect frontend (HTML + JS) with backend API.

---

### 🔐 1. Login Integration (auth.js) (I have done this login API integration)

```js
async function login() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  // Save token
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  window.location.href = "home.html";
}
```

---

### 👤 2. Get Profile (profile.js)

```js
async function loadProfile() {
  const res = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: authHeaders()
  });

  const user = await res.json();

  document.getElementById("name").innerText = user.name;
  document.getElementById("email").innerText = user.email;
}
```

---

### 🎞️ 3. Load Items (search.js / home.js)

```js
async function loadItems() {
  const res = await fetch(`${API_BASE_URL}/items`);
  const items = await res.json();

  renderItems(items);
}
```

---

### 🔍 4. Search + Filter (Frontend)

```js
function applyFilters(items) {
  return items.filter(item => {
    return (
      (filters.search === "" || item.title.toLowerCase().includes(filters.search)) &&
      (filters.type === "all" || item.type === filters.type) &&
      (filters.genre === "all" || item.genre === filters.genre) &&
      (filters.year === "all" || item.year == filters.year) &&
      (filters.rating === "all" || item.rating >= filters.rating)
    );
  });
}
```

---

### ⭐ 5. Add Review (review.js)

```js
async function submitReview(itemId) {
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ itemId, rating, comment })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  alert("Review added!");
}
```

---

### 📖 6. Get Reviews (review.js)

```js
async function loadReviews(itemId) {
  const res = await fetch(`${API_BASE_URL}/reviews/item/${itemId}`);
  const reviews = await res.json();

  console.log(reviews);
}
```

---

### 📌 7. Add to Watchlist (watchlist.js)

```js
async function addToWatchlist(itemId) {
  const res = await fetch(`${API_BASE_URL}/watchlist`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ itemId })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  alert("Added to watchlist");
}
```

---

### 📌 8. Get Watchlist

```js
async function loadWatchlist() {
  const res = await fetch(`${API_BASE_URL}/watchlist`, {
    headers: authHeaders()
  });

  const data = await res.json();

  const items = data.map(w => w.itemId);

  renderItems(items);
}
```

---

### ❌ 9. Remove from Watchlist

```js
async function removeFromWatchlist(itemId) {
  const res = await fetch(`${API_BASE_URL}/watchlist/${itemId}`, {
    method: "DELETE",
    headers: authHeaders()
  });

  const data = await res.json();

  alert(data.message);
}
```

---

### 🔓 10. Logout

```js
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
```

---

## ⚠️ Important Notes for Frontend Integration

### 📌 1. Script Loading Order (VERY IMPORTANT)

Always include `api.js` **BEFORE** any other JavaScript file.

✅ Correct:
```html
<script src="js/api.js"></script>
<script src="js/search.js"></script>
```

❌ Wrong:
```html
<script src="js/search.js"></script>
<script src="js/api.js"></script>
```

### ❗ Why?

Because `api.js` contains:
```js
const API_BASE_URL = "http://localhost:5000/api";
```

If you load other JS files first, you will get error:
```
API_BASE_URL is not defined
```

---

### 📌 2. Always Use Token for Protected Routes

Use this helper:
```js
authHeaders()
```

Example:
```js
fetch(`${API_BASE_URL}/users/profile`, {
  headers: authHeaders()
});
```

---

### 📌 3. Always Use MongoDB `_id`

Backend uses MongoDB ObjectId.

✅ Correct:
```js
item._id
```

❌ Wrong:
```js
item.id
```

---

### 📌 4. Remove All Mock Data

❌ Do NOT use:
```js
const mockData = [...]
```

✅ Replace with:
```js
fetch(`${API_BASE_URL}/items`)
```

---

### 📌 5. Backend Must Be Running

Before testing frontend:

```bash
cd entertainme-backend
npm run dev
```

Then open frontend HTML normally.

---

### 📌 6. Login First Before Testing

Some APIs require token:
- Profile
- Watchlist
- Add Review

So:
1. Login
2. Save token
3. Then test features

---

## 🧪 Example Full Flow

```txt
1. User login → get token
2. Save token in localStorage
3. Use token for all API requests
4. Load items from /api/items
5. Add to watchlist via API
6. Submit review via API
7. Fetch watchlist & reviews dynamically
```

---

## 🚀 Final Reminder

👉 Remove ALL mock data from frontend  
👉 Replace everything with API calls  

---

## 👥 Team Members and Responsibilities

| Name | Responsibility |
|---|---|
| Soh Chang Zheng | Team Leader, Backend, Search and Filter Module |
| Tiew Yi Xu | Dashboard and Recommendation Module |
| Tay Yi Lin | Rating and Review Module |
| Kwong Jia Yee | Watchlist Module |
| Boo Ee Vone | Authentication Module |
| See Chan Sing | Profile Management Module |

---

## ✅ Current Progress

| Part | Status |
|---|---|
| Frontend UI | Completed |
| Backend API | Almost completed |
| MongoDB Connection | Completed |
| API Integration | In progress |
| Final Testing | Pending |

---

## 📌 Important Instructions for Team Members

Each member should:

1. Pull the latest GitHub code.
2. Run backend using `npm run dev`.
3. Open frontend using Live Server.
4. Replace mock data with API calls.
5. Use `fetch()` to connect frontend with backend.
6. Use MongoDB `_id` instead of old frontend `id`.
7. Test API using Postman before connecting frontend.
8. Commit only working code.

---

## 🚨 Common Errors

| Error | Meaning | Solution |
|---|---|---|
| `401 Unauthorized` | Token missing or invalid | Login again and include token |
| `404 Not Found` | Wrong API endpoint | Check route path |
| `500 Server Error` | Backend error | Check terminal error |
| `buffering timed out` | MongoDB not connected | Check MongoDB connection |
| `Cannot read property value of null` | HTML input ID missing | Check input ID |
| `Cast to ObjectId failed` | Invalid MongoDB ID | Use valid `_id` |

---

## 🔒 GitHub Rules

Do not push:

```txt
node_modules/
.env
```

Make sure `.gitignore` contains:

```txt
node_modules
.env
```

---

## 🧪 Testing Flow

Recommended testing order:

```txt
1. Register account
2. Login account
3. View profile
4. Add items
5. Search items
6. Add to watchlist
7. View watchlist
8. Add review
9. View reviews
```

---

## 🚀 Final Goal

The final system should:
- Use real MongoDB data
- Use backend API
- Remove frontend mock data
- Support login session
- Allow dynamic watchlist
- Allow dynamic review and rating
- Work smoothly through frontend pages

---
