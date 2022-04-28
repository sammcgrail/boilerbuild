import { WEBPACK_CONFIG } from "./webpack.config";
import WebpackDevServer from "webpack-dev-server";
import webpack from "webpack";
import * as path from "path";
import express from "express";
import * as http from "http";
import { WEBPACK_DEV_SERVER_PORT } from "./shared/constants";

const app = express();
const server = http.createServer(app);

// let lastFreshTimeout: NodeJS.Timeout | number;

// app.get("/debug", (req, res) => {
//   res.sendFile(path.join(__dirname, "debug.html"));
// });

const clientWebpackServer = new WebpackDevServer(
  {
    port: WEBPACK_DEV_SERVER_PORT,
  },
  webpack(WEBPACK_CONFIG)
);

clientWebpackServer.startCallback((err): void => {
  if (err) {
    console.log(err);
  }
  console.log("WEBPACK DEV SERVER AT localhost:", WEBPACK_DEV_SERVER_PORT);
});
