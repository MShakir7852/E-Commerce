require("dotenv").config();

const express = require("express");
const connectDB = require("./database/db.js");
const router = require("./routes/userRoute.js");
const cors = require("cors");
const productRouter = require("./routes/productRout.js");
const categoryRouter = require("./routes/categortRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
// import adminDashboardRoute from "./routes/adminDashboardRoutes.js";
const adminDashboardRoute=require("./routes/adminDashboardRoutes.js")

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", router);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRoutes);
app.use(
    "/api/admin/dashboard",
    adminDashboardRoute
);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  connectDB();
  console.log(`server is running at ${port}`);
});