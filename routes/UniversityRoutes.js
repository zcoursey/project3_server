import express from "express";
import pool from "./PoolConnection.js";

const universityRouter = express.Router();

// Get all universities
universityRouter.get("/", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM universities");
      if (result.rows.length === 0) {
        return res.json({ message: "No universities found" });
      }
      res.json(result.rows);
    } catch (error) {
      console.error("Query error:", error);
      res.status(500).send("Database query failed");
    }
  });

// Get a university by ID
universityRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM universities WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).send("Database query failed");
  }
});

// Delete a university by ID
universityRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM universities WHERE id = $1", [id]);
    res.send("University deleted successfully");
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).send("Database query failed");
  }
});

// Create a new university
universityRouter.post("/", async (req, res) => {
  try {
    const { name, location, description, imageurl, is_public } = req.body;
    const result = await pool.query(
      `INSERT INTO universities (name, location, description, imageurl, is_public)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, location, description, imageurl, is_public]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating university:", error);
    res.status(500).json({ error: "Failed to create university" });
  }
});

// Update an existing university
universityRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description, imageurl, is_public } = req.body;
    const result = await pool.query(
      `UPDATE universities
       SET name = $1, location = $2, description = $3, imageurl = $4, is_public = $5
       WHERE id = $6
       RETURNING *`,
      [name, location, description, imageurl, is_public, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating university:", error);
    res.status(500).json({ error: "Failed to update university" });
  }
});


export default universityRouter;
