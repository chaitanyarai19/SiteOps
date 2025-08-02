require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB connection error:", err.message));

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const sitesRouter = require('./routes/sites');
const ticketsRouter = require('./routes/tickets');
const usersRouter = require('./routes/users');
// const dashboardRouter = require('./routes/dashboard');

app.use('/api/sites', sitesRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/users', usersRouter);
// app.use('/api/dashboard', dashboardRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
