import express from "express";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

app.use(express.json());

connectDB();

await Category.insertMany([{ name: "Electronics" }, { name: "Books" }]);
const categories = await Category.find(); // Получить категории из базы данных.

await Product.insertMany([
  {
    name: "Phone",
    price: 20,
    category: categories[0]._id,
  },
  {
    name: "Book",
    price: 10,
    category: categories[1]._id,
  },
]);

app.post("/categories", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(404).json({ error: "Field must be filled" });
  }
  Category.create({ name })
    .then(() => {
      res.status(201).json({ message: "Category added" });
    })
    .catch((error) => {
      console.error("Error occered creating category: ", error);
      res.status(400).json({ error: "Error occered creating category" });
    });
});

app.post("/products", async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(404).json({ error: "Fields must be filled" });
    }

    // Проверяем, существует ли категория
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    const product = new Product({
      name,
      price,
      category,
    });
    await product.save();
    res.status(201).json({ message: "Product was created" });
  } catch (error) {
    res.status(400).json({
      message: "an error occered creating product: ",
      error: error.message,
    });
  }
});
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name"); // Подгружаем только поле "name" из категории
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
