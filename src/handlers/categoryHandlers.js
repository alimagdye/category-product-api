import prisma from "../config/dbConfigs.js";
import sanitizeHtml from "sanitize-html";

export const getAllCategories = async function (req, res) {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({
      msg: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error while fetching categories", error.message); // log the error message to the console
    // this will help us to debug the error in the server console

    // but never respond with the error message to the client, because it may contain sensitive information
    res.status(500).json({
      msg: "Internal server error while fetching categories",
    });
  }
};

export const getCategoryById = async function (req, res) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        
      }
    });
    if (!category) {
      return res.status(404).json({ msg: "Category not found!" });
    }

    res.status(200).json({
      msg: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error while fetching category", error.message);
    res.status(500).json({
      msg: "Internal server error while fetching category",
    });
  }
};

export const createCategory = async function (req, res) {
  try {
    const category = await prisma.category.create({
      data: {
        name: sanitizeHtml(req.body.name),
      },
    });

    res
      .status(201)
      .json({ msg: "Category created successfully", data: category });
  } catch (error) {
    console.error("Error while creating category", error.message);

    // if we tried to create a category with the same name as an existing one, prisma will throw an error with code P2002 because the name field is unique in the database
    if (error.code === "P2002") {
      return res.status(409).json({
        msg: `'${sanitizeHtml(req.body.name)}' category already exists`,
      });
    }

    res.status(500).json({
      msg: "Internal server error while creating category",
    });
  }
};

export const updateCategoryName = async function (req, res) {
  try {
    const categoryName = await prisma.category.findUnique({
      select: {
        // this will only select the name field from the category
        name: true,
      },
      where: {
        id: req.params.id,
      },
    });
    // this will return {name: "any name"} if the category exists, and {} if it doesn't exist

    // if we tried to update a category with id doesn't exist, findUnique will return {}, so we can check the name exist or not if categoryName.name isn't null only
    if (categoryName?.name === sanitizeHtml(req.body.name)) {
      return res.status(409).json({
        msg: `Category with name ${sanitizeHtml(
          req.body.name
        )} already exists!`,
      });
    }

    const category = await prisma.category.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: sanitizeHtml(req.body.name),
      },
    });

    res
      .status(200)
      .json({ msg: "Category updated successfully", data: category });
  } catch (error) {
    console.error("Error while updating category;", error.message);

    // if we tried to update a category that does not exist, prisma will throw an error with code P2025, because the id does not exist in the database
    if (error.code === "P2025") {
      return res.status(404).json({ msg: "Category not found!" });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        msg: `Category with name '${sanitizeHtml(
          req.body.name
        )}' already exists!`,
      });
    }

    res.status(500).json({
      msg: "Internal server error while updating category",
    });
  }
};

export const deleteCategory = async function (req, res) {
  try {
    await prisma.category.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).send(); // 204 No Content response indicates that the request was successful and the server has no additional information to send back (RESTful API best practice)
  } catch (error) {
    console.error("Error while deleting category", error.message);

    if (error.code === "P2025") {
      // if we tried to delete a category that does not exist, prisma will throw an error with code P2025, because the id does not exist in the database
      return res.status(404).json({ msg: "Category not found!" });
    }

    res.status(500).json({
      msg: "Internal server error while deleting category",
    });
  }
};
