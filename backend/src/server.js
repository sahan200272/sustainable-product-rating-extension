const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());

app.use("/", (req, res) => {
    res.send("backend is working");
});

app.listen(PORT, () => {
    console.log(`app is running on http://localhost:${PORT}`);
});