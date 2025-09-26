import express from "express";
import http from "http";
import logger from "morgan";
import cors from "cors";

import channelWebsocket from "./websockets/channelWebsocket";

// import indexRouter from "./routes/index";
 import usersRouter from "./routes/v1/users";

var app = express();
const server = http.createServer(app);

channelWebsocket(server);

const corsConfig = {
    origin: ["http://localhost:3000", "https://cautious-space-eureka-rwjpxj9v6653p65g-3000.app.github.dev"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsConfig));
app.options(/(.*)/, cors(corsConfig));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", usersRouter);
// app.use("/channels", channelRouter);

// 404 catch-all handler
app.use((req, res, next) => {
    console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});