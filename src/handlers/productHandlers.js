import prisma from "../config/dbConfigs.js";
import sanitizeHtml from "sanitize-html";

export const getAllProducts = async function (req, res) {
  try {
    const products = await prisma.product.findMany({
      // include the category table data in the response
      include: {
        category: {
          select: {
            // select only the id and name fields from the category table
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true, // omit the categoryId field from the response
      },
    });

    res.status(200).json({
      msg: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error while fetching products", error.message);
    res.status(500).json({
      msg: "Internal server error while fetching products",
    });
  }
};

export const getProductById = async function (req, res) {
  try {
    const product = await prisma.product.findUnique({
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
        categoryId: true,
      },
    });
    if (!product) {
      return res.status(404).json({ msg: "Product not found!" });
    }

    res.status(200).json({
      msg: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error while fetching product", error.message);
    res.status(500).json({
      msg: "Internal server error while fetching product",
    });
  }
};

export const createProduct = async function (req, res) {
  try {
    const { name, price, categoryId, description, currency, quantity, exists } =
      req.body; // destructure the request body to get the name and price

    let data = {
      name: sanitizeHtml(name),
      price: parseFloat(price), // convert string to number
      categoryId: categoryId,
    };
    if (description) {
      data.description = sanitizeHtml(description); // if description is provided, sanitize it
    }
    if (currency) {
      data.currency = sanitizeHtml(currency); // if currency is provided, sanitize it
    }
    if (quantity) {
      data.quantity = parseInt(quantity); // if quantity is provided, convert string to number
    }
    if (exists) {
      data.exists = Boolean(exists);
    }

    const product = await prisma.product.create({
      data,
    });

    res.status(201).json({
      msg: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error while creating product", error.message);

    // if we tried to create a product with the same name as an existing one, prisma will throw an error with code P2002 because the name field is unique in the database
    if (error.code === "P2002") {
      return res.status(409).json({
        msg: `'${sanitizeHtml(req.body.name)}' product already exists`,
      });
    }

    // if we tried to create a product has a category that does not exist, prisma will throw an error with code P2003, because the id does not exist in the database
    if (error.code === "P2003") {
      return res.status(400).json({ msg: "Category not found!" });
    }

    res.status(500).json({
      msg: "Internal server error while creating product",
    });
  }
};

export const updateProduct = async function (req, res) {
  try {
    const { name, price, categoryId, description, currency, quantity, exists } =
      req.body; // destructure the request body to get the name and price
    let data = {};
    if (name) data.name = sanitizeHtml(name);
    if (price !== undefined) data.price = parseFloat(price); // convert string to number
    if (categoryId) data.categoryId = categoryId;
    if (description) data.description = sanitizeHtml(description);
    if (currency) data.currency = sanitizeHtml(currency);
    if (quantity !== undefined) data.quantity = parseInt(quantity);
    if (exists !== undefined)
      // check if exists is provided
      data.exists = // it accepts true, false, 1, 0, "true", "false", "1", "0"
        exists === "true" || exists === 1 || exists === "1" ? true : false; // convert string to boolean
    if (Object.keys(data).length === 0) {
      // if no data is provided to update, return 422 Unprocessable Entity
      return res.status(422).json({ msg: "No data provided to update" });
    }

    console.log(data);
    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        categoryId: true, // omit the category_id field from the response
      },
    });

    res.status(200).json({
      msg: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error while updating product", error.message);

    if (error.code === "P2002") {
      // if we tried to update a product with the same name as an existing one, prisma will throw an error with code P2002 because the name field is unique in the database
      return res.status(409).json({
        msg: `'${sanitizeHtml(req.body.name)}' product already exists`,
      });
    }

    // if we tried to update a category that does not exist, prisma will throw an error with code P2025, because the id does not exist in the database
    if (error.code === "P2025") {
      return res.status(404).json({ msg: "Product not found!" });
    }

    res.status(500).json({
      msg: "Internal server error while updating product",
    });
  }
};

export const deleteProduct = async function (req, res) {
  try {
    await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error("Error while deleting product", error.message);

    // if we tried to update a category that does not exist, prisma will throw an error with code P2025, because the id does not exist in the database
    if (error.code === "P2025") {
      return res.status(404).json({ msg: "Product not found!" });
    }

    res.status(500).json({
      msg: "Internal server error while deleting product",
    });
  }
};
