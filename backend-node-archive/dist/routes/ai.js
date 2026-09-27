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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generative_ai_1 = require("@google/generative-ai");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
router.use(auth_1.authenticateToken);
router.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        // Fetch some basic stats to give the AI context
        const items = yield prisma.item.findMany();
        const totalItems = items.length;
        const totalValue = items.reduce((acc, item) => acc + (item.costPrice * item.stockCount), 0);
        const potentialProfit = items.reduce((acc, item) => acc + ((item.sellPrice - item.costPrice) * item.stockCount), 0);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are a helpful business assistant for "Bura Market Handler". 
Here is the current state of the inventory:
- Total unique items: ${totalItems}
- Total inventory value (cost): $${totalValue.toFixed(2)}
- Potential profit: $${potentialProfit.toFixed(2)}

The user asks: "${message}"

Provide a concise, helpful response.`;
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        const text = response.text();
        res.json({ reply: text });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate AI response. Make sure GEMINI_API_KEY is set in .env' });
    }
}));
exports.default = router;
