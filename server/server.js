const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANT: database name must match folder
mongoose.connect("mongodb://127.0.0.1:27017/Group-01-HW7")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Schema
const listSchema = new mongoose.Schema({
  title: String,
  entries: [
    {
      text: String,
      status: Boolean
    }
  ]
});

const List = mongoose.model("List", listSchema);


// ================= ROUTES =================

// Get all lists
app.get("/lists", async (req, res) => {
  const lists = await List.find();
  res.json(lists);
});

// Create list
app.post("/lists", async (req, res) => {
  const newList = new List({
    title: req.body.title,
    entries: []
  });
  await newList.save();
  res.json(newList);
});

// Add entry
app.post("/lists/:id/entries", async (req, res) => {
  const list = await List.findById(req.params.id);
  list.entries.push({
    text: req.body.text,
    status: false
  });
  await list.save();
  res.json(list);
});

// Toggle status
app.put("/lists/:listId/entries/:entryId", async (req, res) => {
  const list = await List.findById(req.params.listId);
  const entry = list.entries.id(req.params.entryId);

  entry.status = !entry.status;

  await list.save();
  res.json(list);
});

// Delete entry
app.delete("/lists/:listId/entries/:entryId", async (req, res) => {
  const list = await List.findById(req.params.listId);
  list.entries = list.entries.filter(e => e._id != req.params.entryId);
  await list.save();
  res.json(list);
});

// Delete list
app.delete("/lists/:id", async (req, res) => {
  await List.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));