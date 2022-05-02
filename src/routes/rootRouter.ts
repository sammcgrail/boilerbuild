import express from "express";
import clientRouter from "./clientRouter";

const rootRouter = express.Router();

rootRouter.use("/", clientRouter);

export default rootRouter;