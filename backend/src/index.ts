import express from "express";
import userRouter from "./routes/user";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use("/api/v1", userRouter);

app.listen(port, () => {
  console.log(`Server Listning on port ${port} `);
});
