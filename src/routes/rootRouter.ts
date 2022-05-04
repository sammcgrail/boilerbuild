import express from "express";
import clientRouter from "./clientRouter";

const rootRouter = express.Router();

console.log('wtf');
rootRouter.get("/pizza", (req, res) => {
  res.send("lol");
})
rootRouter.use("/", clientRouter);

export default rootRouter;