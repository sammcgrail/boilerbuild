import express from "express";
import clientIndexPath from "../config/getClientIndexPath";

const clientRouter = express.Router();
const clientRoutes = ["/", "/pizza"];

clientRouter.get(clientRoutes, (req, res) => {
  console.log("client Route");
  res.sendFile(clientIndexPath())
})

export default clientRouter;
