import express from "express";
import cors from "cors";
import universityRouter from "./routes/UniversityRoutes.js";
import userRouter from "./routes/UserRoutes.js";
import roleRouter from "./routes/RoleRoutes.js";

const app = express();

app.use(cors({
  origin: "https://mini-proj3-front.vercel.app",
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/universities", universityRouter);
app.use("/users", userRouter);
app.use("/roles", roleRouter);

app.get("/", (req, res) => {
  res.send("Hello from South Carolina Colleges API!");
});


export default app;

