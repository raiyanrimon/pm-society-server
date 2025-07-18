import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./app/routes";
import notFound from "./app/middlewares/notFound";

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: ["https://pm-society.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/", router);

// app.use(globalErrorHandler);

app.use(notFound);

export default app;
