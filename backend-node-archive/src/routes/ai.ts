import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

router.use(authenticateToken);

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Fetch some basic stats to give the AI context
    const items = await prisma.item.findMany();
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate AI response. Make sure GEMINI_API_KEY is set in .env' });
  }
});

export default router;
