import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import itemRoutes from './routes/items';
import aiRoutes from './routes/ai';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads'))); 

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Bura Market Handler API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
