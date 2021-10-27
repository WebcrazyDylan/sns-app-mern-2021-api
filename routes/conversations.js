const router = require("express").Router();
const Conversation = require("../models/Conversation");

// Post new conversation
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId]
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get conversation of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get conversation includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] }
    });
    if (conversation) {
      return res.status(200).json(conversation);
    } else {
      const newConversation = new Conversation({
        members: [req.params.firstUserId, req.params.secondUserId]
      });
      const savedConversation = await newConversation.save();
      return res.status(200).json(savedConversation);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
