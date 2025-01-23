import { Router } from "express";
import { middleware } from "../middleware";
import Client from "../db";

const router = Router();
//@ts-ignore
router.post("/notes", middleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    //@ts-ignore
    const userId = req.userId;

    if (!title || !content) {
      return res.status(400).json({
        status: "error",
        message: "Title and content are required",
      });
    }

    const newNote = await Client.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        userId,
      },
    });

    res.status(201).json({
      status: "success",
      data: newNote,
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      status: "error",
      message:  "Failed to create note",
    });
  }
});
router.get("/notes", middleware, async (req, res) => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const notes = await Client.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "success",
      data: notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve notes",
    });
  }
});
//@ts-ignore
router.put("/notes/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    //@ts-ignore
    const userId = req.userId;

    // Verify note ownership
    const existingNote = await Client.note.findUnique({
      where: { id, userId },
    });

    if (!existingNote) {
      return res.status(404).json({
        status: "error",
        message: "Note not found or unauthorized",
      });
    }

    const updatedNote = await Client.note.update({
      where: { id, userId },
      data: {
        title: title.trim(),
        content: content.trim(),
      },
    });

    res.status(200).json({
      status: "success",
      data: updatedNote,
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(400).json({
      status: "error",
      message: (error as any).message || "Failed to update note",
    });
  }
});

// Delete a specific note
//@ts-ignore
router.delete("/notes/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    //@ts-ignore
    const userId = req.userId;

    // Verify note ownership before deletion
    const existingNote = await Client.note.findUnique({
      where: { id, userId },
    });

    if (!existingNote) {
      return res.status(404).json({
        status: "error",
        message: "Note not found or unauthorized",
      });
    }

    await Client.note.delete({
      where: { id, userId },
    });

    res.status(200).json({
      status: "success",
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete note",
    });
  }
});
export default router;
