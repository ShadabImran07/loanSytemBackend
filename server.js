import path from "path";
import express from "express";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import customerRoutes from "./routes/customerRoutes.js";
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", customerRoutes);

app.get("/", (req, res) => {
	res.sendStatus(200);
});

app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
	console.log("listening on ports: " + port);
});
