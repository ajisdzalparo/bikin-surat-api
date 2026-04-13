import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
import { NotFound } from "./middleware/error.midleware";

dotenv.config();

const app = express();

app.use(express.json());

const allowOrigins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"];
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "Health check",
  });
});

app.use("/api", routes);
app.use(NotFound);

export default app;
