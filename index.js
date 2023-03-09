import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import User from "./Models/User.js";

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//Routes
app.post("/auth/register", async (req, res) => {
  try {
    const {
      firstName,
      //   lastName,
      //   email,
      password,
      //   picturePath,
      //   friends,
      //   location,
      //   occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const HashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      //   lastName,
      //   email,
      password: HashedPassword,
      //   picturePath,
      //   friends,
      //   location,
      //   occupation,
      impressions: Math.floor(Math.random * 1000),
      viewedProfile: Math.floor(Math.random * 1000),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
await mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(() => console.log(`Server listening on ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
