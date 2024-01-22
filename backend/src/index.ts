import express from "express";
import userRouter from "./routes/user";

const app = express();
const port = process.env.PORT || 3000;

app.use("/api/v1", userRouter);

app.listen(port, () => {
  console.log(`Server Listning on port ${port} `);
});
