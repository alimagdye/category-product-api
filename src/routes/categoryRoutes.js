import { Router } from "express";
import { body, param } from "express-validator";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryName,
  deleteCategory,
} from "../handlers/categoryHandlers.js";
import { validateInput } from "../middlewares/validation.js";

// these routes are mounted on /categories
const categoryRoutes = Router();

categoryRoutes.get("/", getAllCategories); // GET /categories

categoryRoutes.get(
  "/:id", // GET /categories/:id
  [
    param("id")
      .trim()
      .notEmpty()
      .withMessage("Category ID is required")
      .bail() // bail will stop the validation chain if this fails
      .isUUID()
      .withMessage("Invalid category ID format"),
  ],
  validateInput,
  getCategoryById
);

categoryRoutes.post(
  "/", // POST /categories
  [
    body("name")
      .trim()
      .escape() // sanitize html tags prevent XSS attacks
      .notEmpty()
      .withMessage("Name is required")
      .bail() // bail will stop the validation chain if this fails
      .isLength({ min: 3, max: 60 })
      .withMessage("Name should be between 3 and 60 characters")
      .matches(/^[a-zA-Z0-9\s]+$/) // regex to allow only letters, numbers, and spaces
      .withMessage("Name should contain only letters, numbers, and spaces"),
  ],
  validateInput,
  createCategory
);

categoryRoutes.put(
  "/:id", // PUT /categories/:id
  [
    param("id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Category ID is required")
      .bail()
      .isUUID()
      .withMessage("Invalid category ID format"),
    body("name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Name is required")
      .bail()
      .isLength({ min: 3, max: 60 })
      .withMessage("Name should be between 3 and 60 characters")
      .matches(/^[a-zA-Z0-9\s]+$/)
      .withMessage("Name should contain only letters, numbers, and spaces"),
  ],
  validateInput,
  updateCategoryName
);

categoryRoutes.delete(
  "/:id", // DELETE /categories/:id
  [
    param("id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Category ID is required")
      .bail()
      .isUUID()
      .withMessage("Invalid category ID format"),
  ],
  validateInput,
  deleteCategory
);

export default categoryRoutes;
