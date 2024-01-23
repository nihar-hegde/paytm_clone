import express from "express";
import mainRooter from "./routes/index";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRooter);

app.listen(port, () => {
  console.log(`Server Listning on port ${port} `);
});
