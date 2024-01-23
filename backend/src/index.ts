import express from "express";
import mainRooter from "./routes/index";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB URI not found!");
}

mongoose.Promise = Promise;
mongoose.connect(mongoUri);
mongoose.connection.on("error", (error: Error) => console.log(error));

mongoose.connection.on("connected", () =>
  console.log("Mongodb connected successfully"),
);

app.use("/api/v1", mainRooter);

app.listen(port, () => {
  console.log(`Server Listning on port ${port} `);
});
