import express from "express";
import {
  errorHandler,
  globalMiddleware,
} from "./middlewares/globalMiddleware.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const PORT = process.env.PORT || 3000; // set the port for the server to listen on

const app = express();

app.use(globalMiddleware); // this middleware will be executed for every request, before the request handler

// always add /api before the routes to avoid conflicts with react routes in the frontend
app.use("/api/categories", categoryRoutes); // this will handle all the routes starting with /api/categories

app.use("/api/products", productRoutes); // this will handle all the routes starting with /api/products

app.use(errorHandler); // if any unxpected synchronous error occurs, this middleware will catch it

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
