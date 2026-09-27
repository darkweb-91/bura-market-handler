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
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
router.use(auth_1.authenticateToken);
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield prisma.item.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category, description, costPrice, sellPrice, stockCount } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const item = yield prisma.item.create({
            data: {
                name,
                category,
                description,
                costPrice: parseFloat(costPrice),
                sellPrice: parseFloat(sellPrice),
                stockCount: parseInt(stockCount, 10),
                imageUrl,
            },
        });
        res.json(item);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { stockCount } = req.body;
        const item = yield prisma.item.update({
            where: { id: Number(id) },
            data: { stockCount: parseInt(stockCount, 10) },
        });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.item.delete({ where: { id: Number(id) } });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
