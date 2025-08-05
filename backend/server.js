require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI,{dbName:"siteops"})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB connection error:", err.message));

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const sitesRouter = require('./routes/sites');
const ticketsRouter = require('./routes/tickets');
const dashboardRouter = require('./routes/dashboard');
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require('./routes/users');
const filesRoutes = require("./routes/filesRoutes");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173", // your React frontend
  credentials: true,               // allow cookies
}));

app.use('/api/users', userRoutes);
app.use('/api/sites', sitesRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use("/api/files", filesRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/upload", uploadRoutes);

app.get("/api/files", async (req, res) => {
  const files = await db.collection("uploads").find().toArray(); // Adjust collection name
  res.json(files);
});




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
