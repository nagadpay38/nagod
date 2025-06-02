import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import chalk from "chalk";
// Import route handlers
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payment.js";

// Import models and data
// Import models and data
import User from "./model/User.js";
import { dataUser } from "./data/index.js";
import agent_route from "./routes/Agent.js";
import { createRequire } from 'module';
import user_route from "./routes/User.js";
const require = createRequire(import.meta.url);
require('module-alias/register');
dotenv.config();

const app = express();

// Increase payload limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(helmet());
app.use(express.static("public"))
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Allow all origins with CORS

app.use(cors( {
  origin:[
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:3000",
      "https://nagodpay.com",
      "https://admin.eassypay.com",
      "https://website.eassypay.com",
      "https://data.eassypay.com",
      "*",
    ], // Specify the allowed origin
  methods: ["GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"], // Specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"," x-api-key"], // Specify allowed headers
  credentials: true, // Allow credentials (cookies, etc.)
  optionsSuccessStatus:200,
}));
app.use(helmet({crossOriginResourcePolicy: false }));

// Set view engine for rendering templates

app.set("view engine", "ejs");

// Custom Morgan Logger with Chalk for Colorful Output
app.use(
  morgan((tokens, req, res) => {
    return [
      chalk.blue.bold(tokens.method(req, res)),
      chalk.yellow(tokens.url(req, res)),
      chalk.green(tokens.status(req, res)),
      chalk.magenta(`${tokens["response-time"](req, res)} ms`),
      chalk.cyan(tokens["remote-addr"](req, res)),
    ].join(" ");
  })
);

// Routes
app.use("/api/client", clientRoutes);
app.use("/api/general", generalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user",user_route)
app.use(agent_route)
app.get("/",(req,res)=>{
  res.send("okkkkkkh")
})
// Database Connection and Server Setup
const PORT = process.env.PORT || 9000;
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(
        chalk.green.bold(`Server Running on Port: http://localhost:${PORT}`)
      )
    );

  })
  .catch((error) =>
    console.log(
      chalk.red.bold(
        `\n\nError: ${error.message} - Could not connect to MongoDB`
      )
    )
  );
