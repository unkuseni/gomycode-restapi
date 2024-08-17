import { Router } from "express";
import User from "./models/user.js";
import mongoose from "mongoose";
import cors from "cors";

// Create a router instance
const router = Router();

router.use(cors()); // Enable CORS for all routes

/**
 * Get all users
 * @route GET /users
 * @returns {Array} An array of user objects
 * @access Public
 */
router.get("/users", async (req, res) => {
	try {
		const users = await User.find(); // Find all users in the database
		res.json(users); // Return the array of user objects as JSON
	} catch (err) {
		res.status(500).json({ message: err.message }); // Return an error message if there is an error
	}
});

/**
 * Create a new user
 * @route POST /users
 * @returns {Object} The newly created user object
 * @access Public
 */
router.post("/users", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).send({
				message:
					"Please provide all required fields: name, email, and password",
			});
		}
		const user = new User({ name, email, password });
		await user.save();
		res.send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

/**
 * Update a user by ID
 * @route PUT /users/:id
 * @param {string} id.path.required - The ID of the user to update
 * @returns {Object} The updated user object
 * @access Public
 */
router.put("/users/:id", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const userId = req.params.id;

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send({ message: "Invalid user ID" });
		}

		if (!name || !email || !password) {
			return res.status(400).send({
				message:
					"Please provide all required fields: name, email, and password",
			});
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{
				name,
				email,
				password,
			},
			{ new: true }
		);

		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		res.send({ message: "User updated successfully", user });
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

/**
 * Delete a user by ID
 * @route DELETE /users/:id
 * @param {string} id.path.required - The ID of the user to delete
 * @returns {Object} An object with a message
 * @access Public
 */
router.delete("/users/:id", async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}
		res.send({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

export default router;

