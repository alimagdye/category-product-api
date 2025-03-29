import { Router } from "express";
import { body, param } from "express-validator";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../handlers/productHandlers.js";
import { validateInput } from "../middlewares/validation.js";

// these routes are mounted on /products
const productRoutes = Router();

productRoutes.get("/", getAllProducts); // GET /products

productRoutes.get(
  "/:id", // GET /products/:id
  [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("Product ID is required")
      .bail() // bail will stop the validation chain if this fails
      .isUUID()
      .withMessage("Invalid product ID format"),
  ],
  validateInput,
  getProductById
);

productRoutes.post(
  "/", // POST /products
  [
    body("name")
      .trim()
      .escape() // sanitize html tags prevent XSS attacks
      .notEmpty()
      .withMessage("Name is required")
      .bail() // bail will stop the validation chain if this fails
      .isLength({ min: 3, max: 60 })
      .withMessage("Name should be between 3 and 60 characters")
      .matches(/^[a-zA-Z0-9\s\']+$/) // regex to allow only letters, numbers, and spaces
      .withMessage("Name should contain only letters, numbers, and spaces"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .bail()
      .isFloat({ min: 0.01 })
      .withMessage("Price should be a positive number"),
    body("categoryId")
      .notEmpty()
      .withMessage("Category ID is required")
      .bail()
      .isUUID()
      .withMessage("Invalid category ID format"),
    body("description")
      .optional()
      .trim()
      .escape() // sanitize html tags prevent XSS attacks
      .isLength({ min: 3, max: 120 })
      .withMessage("Description should be between 3 and 120 characters"),
    body("currency")
      .optional()
      .trim()
      .escape()
      .isLength({ min: 3, max: 3 })
      .withMessage("Currency should be exactly 3 characters"),
    body("quantity")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Quantity should be a positive number"),
    body("exists")
      .optional()
      .isBoolean()
      .withMessage("Exists should be a boolean"),
  ],
  validateInput,
  createProduct
);

productRoutes.put(
  "/:id", // PUT /products/:id
  [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("Product ID is required")
      .bail()
      .isUUID()
      .withMessage("Invalid product ID format"),
    body("name")
      .optional()
      .trim()
      .escape() // sanitize html tags prevent XSS attacks
      .isLength({ min: 3, max: 60 })
      .withMessage("Name should be between 3 and 60 characters")
      .matches(/^[a-zA-Z0-9\s\']+$/) // regex to allow only letters, numbers, and spaces
      .withMessage("Name should contain only letters, numbers, and spaces"),
    body("price")
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage("Price should be a positive number"),
    body("categoryId")
      .optional()
      .isUUID()
      .withMessage("Invalid category ID format"),
    body("description")
      .optional()
      .trim()
      .escape() // sanitize html tags prevent XSS attacks
      .isLength({ min: 3, max: 120 })
      .withMessage("Description should be between 3 and 120 characters"),
    body("currency")
      .optional()
      .trim()
      .escape()
      .isLength({ min: 3, max: 3 })
      .withMessage("Currency should be exactly 3 characters"),
    body("quantity")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Quantity should be a positive number"),
    body("exists")
      .optional()
      .isBoolean()
      .withMessage("Exists should be a boolean"),
  ],
  validateInput,
  updateProduct
);

productRoutes.delete(
  "/:id", // DELETE /products/:id
  [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("Product ID is required")
      .bail()
      .isUUID()
      .withMessage("Invalid product ID format"),
  ],
  validateInput,
  deleteProduct
);

export default productRoutes; // export the routes to be used in the server file
