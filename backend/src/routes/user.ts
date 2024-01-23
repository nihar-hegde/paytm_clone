import express from "express";

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send("Requrest came from index.ts -> router/index.ts -> user.ts");
});

export default router;
