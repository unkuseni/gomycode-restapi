import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import router from "./server.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const dbConnect = async () => {
	try {
		const conn = await mongoose.connect(
			`mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster1.d0oxp0v.mongodb.net/?retryWrites=true&w=majority&appName=cluster1`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		console.log("MongoDB Connected:", conn.connection.host);
	} catch (err) {
		console.error("Error:", err.message);
		process.exit(1);
	}
};

dbConnect();

app.use("/", router);

app.listen(process.env.PORT || 3000, () => {
	console.log("Server is running on port", process.env.PORT || 3000);
});

