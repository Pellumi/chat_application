const express = require("express");
const connection = require("../db/connect");
// const authentication = require("../middleware/auth");

const conversationRouter = express.Router();

conversationRouter.post("/create", async (req, res) => {
  const { user1_id, user2_id } = req.body;

  if (!user1_id || !user2_id) {
    return res.status(400).json({ message: "Missing user IDs" });
  }

  try {
    const query =
      "INSERT INTO Conversations (user1_id, user2_id) VALUES (?, ?)";
    await connection.promise().query(query, [user1_id, user2_id]);

    res.status(201).json({ message: "Conversation created successfully" });
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ message: "Server error" });
  }
});

conversationRouter.get("/contact/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  connection.query(
    `SELECT c.id AS conversation_id, u.id AS user_id, u.username, u.first_name, u.last_name 
    FROM users u 
    JOIN conversations c 
    ON (
    (c.user1_id = u.id AND c.user2_id = ?)
    OR 
    (c.user2_id = u.id AND c.user1_id = ?)
    )`,
    [userId, userId],
    (err, results) => {
      if (err) {
        console.error("Error retrieving contacts:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      res.status(200).json(results);
    }
  );
});

module.exports = conversationRouter;
