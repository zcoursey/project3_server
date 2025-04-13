import express from "express";
import pool from "./PoolConnection.js";

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).send("Database query failed");
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).send("Database query failed");
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.send("User deleted successfully");
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).send("Database query failed");
  }
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.role_id === 1, // assuming role_id 1 is admin
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error during login");
  }
});

userRouter.post("/register", async (req, res) => {
  const { firstName, lastName, email, city, zipCode, username, password } = req.body;

  try {
    const role_id = 2; // regular user by default
    const result = await pool.query(
      `INSERT INTO users (username, email, password, role_id, first_name, last_name, city, zip_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, username, role_id`,
      [username, email, password, role_id, firstName, lastName, city, zipCode]
    );

    res.status(201).json({ message: "User registered", user: result.rows[0] });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Error registering user");
  }
});




export default userRouter;
