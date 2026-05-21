const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
const session = require("express-session");
require("dotenv").config();

const passport = require("./config/passport");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/watchlist", require("./routes/watchlistRoutes"));

app.get("/", (req, res) => {
  res.send("EntertainMe API is running");
});

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.log("MongoDB error name:", err.name);
    console.log("MongoDB error message:", err.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});