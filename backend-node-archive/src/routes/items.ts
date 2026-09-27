import { Router } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, costPrice, sellPrice, stockCount } = req.body;
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await prisma.item.create({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stockCount } = req.body;
    
    const item = await prisma.item.update({
      where: { id: Number(id) },
      data: { stockCount: parseInt(stockCount, 10) },
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.item.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
