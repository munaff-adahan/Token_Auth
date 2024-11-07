import express from 'express';
import { config } from "dotenv";
import dbConnect from './dbConnect1.js';
import authRoutes from './routes/auth.js';




const app = express();

config();
dbConnect();

app.use(express.json());

app.use("/api", authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => { console.log(`Server is running on port ${port}`) });