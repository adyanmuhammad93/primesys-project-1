import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = process.env.VITE_SERVER_PORT || 5000;

app.use(cors());

// This will let us get the data sent via POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use routes
app.use("/", contactRoutes);
app.use("/", receiptRoutes);
app.use("/", invoiceRoutes);
app.use("/", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
