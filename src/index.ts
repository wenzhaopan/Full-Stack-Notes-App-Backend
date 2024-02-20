import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Create Express app
const app = express();
const prisma = new PrismaClient();

// Middleware to parse JSON requests and enable CORS
app.use(express.json());
app.use(cors());

// Endpoint for user login
app.post("/login", (req, res) => {
  const { password } = req.body;
  
  // Check if the password is equal to "NotesAppPassword"
  if (password === "NotesAppPassword") {
    // Password is correct, return success response
    res.status(200).json({ message: "Login successful" });
  } else {
    // Password is incorrect, return unauthorized response
    res.status(401).json({ message: "Incorrect password" });
  }
});

// Endpoint to fetch all notes
app.get("/api/notes", async (req, res) => {
  // Retrieve all notes from the database
  const notes = await prisma.note.findMany();
  // Send the notes as JSON response
  res.json(notes);
});

// Endpoint to create a new note
app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  // Check if title and content are provided
  if (!title || !content) {
    // If not, send a bad request response
    return res.status(400).send("title and content fields required");
  }
  try {
    // Create a new note in the database
    const note = await prisma.note.create({
      data: { title, content },
    });
    // Send the created note as JSON response
    res.json(note);
  } catch (error) {
    // If an error occurs, send a server error response
    res.status(500).send("Oops, something went wrong");
  }
});

// Endpoint to update a note by ID
app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);
  // Check if title and content are provided
  if (!title || !content) {
    // If not, send a bad request response
    return res.status(400).send("title and content fields required");
  }
  // Check if the ID is a valid number
  if (!id || isNaN(id)) {
    // If not, send a bad request response
    return res.status(400).send("ID must be a valid number");
  }
  try {
    // Update the note in the database
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    // Send the updated note as JSON response
    res.json(updatedNote);
  } catch (error) {
    // If an error occurs, send a server error response
    res.status(500).send("Oops, something went wrong");
  }
});

// Endpoint to delete a note by ID
app.delete("/api/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  // Check if the ID is provided and a valid number
  if (!id || isNaN(id)) {
    // If not, send a bad request response
    return res.status(400).send("ID field required");
  }
  try {
    // Delete the note from the database
    await prisma.note.delete({
      where: { id },
    });
    // Send a no content response
    res.status(204).send();
  } catch (error) {
    // If an error occurs, send a server error response
    res.status(500).send("Oops, something went wrong");
  }
});

// Start the server and listen on port 5000
app.listen(5000, () => {
  console.log("Server running on localhost:5000");
});
