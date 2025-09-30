const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const cors = require("cors");

connectDB();

const app = express();

app.use(cors({
     origin: 'https://your-frontend-url.netlify.app'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);
