import express from "express";
import pool from "./PoolConnection.js";

const roleRouter = express.Router();

roleRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM roles");
    res.json(result.rows);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).send("Database query failed");
  }
});

roleRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM roles WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).send("Database query failed");
  }
});

roleRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM roles WHERE id = $1", [id]);
    res.send("Role deleted successfully");
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).send("Database query failed");
  }
});

export default roleRouter;
