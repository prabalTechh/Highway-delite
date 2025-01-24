"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
//@ts-ignore
router.post("/notes", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newNote = yield db_1.default.note.create({
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
    }
    catch (error) {
        console.error("Create note error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to create note",
        });
    }
}));
router.get("/notes", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.userId;
        const notes = yield db_1.default.note.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            status: "success",
            data: notes,
        });
    }
    catch (error) {
        console.error("Get notes error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to retrieve notes",
        });
    }
}));
//@ts-ignore
router.put("/notes/:id", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        //@ts-ignore
        const userId = req.userId;
        // Verify note ownership
        const existingNote = yield db_1.default.note.findUnique({
            where: { id, userId },
        });
        if (!existingNote) {
            return res.status(404).json({
                status: "error",
                message: "Note not found or unauthorized",
            });
        }
        const updatedNote = yield db_1.default.note.update({
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
    }
    catch (error) {
        console.error("Update note error:", error);
        res.status(400).json({
            status: "error",
            message: error.message || "Failed to update note",
        });
    }
}));
// Delete a specific note
//@ts-ignore
router.delete("/notes/:id", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        //@ts-ignore
        const userId = req.userId;
        // Verify note ownership before deletion
        const existingNote = yield db_1.default.note.findUnique({
            where: { id, userId },
        });
        if (!existingNote) {
            return res.status(404).json({
                status: "error",
                message: "Note not found or unauthorized",
            });
        }
        yield db_1.default.note.delete({
            where: { id, userId },
        });
        res.status(200).json({
            status: "success",
            message: "Note deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete note error:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to delete note",
        });
    }
}));
exports.default = router;
