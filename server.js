const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/api/test", (req, res) => {
    res.send("To-Do App Backend Working....");
});

// MongoDB database connect and server start
connectDB().then(() => {
    app.listen(process.env.PORT, () =>
        console.log(`🚀 Server running at http://localhost:${process.env.PORT}`)
    );
});
