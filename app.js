import './loadEnv.js';
import express from "express";
import cors from "cors";
import router from './src/routes/index.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Mount the router with all routes
app.use("/api/v1", router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Auth endpoints available at http://localhost:${PORT}`);
});
