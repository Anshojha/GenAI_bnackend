import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/mongodb.js';
import userRouter from './routes/user.routes.js';
import imageRouter from './routes/image.routes.js';



const PORT = process.env.PORT || 4000;

const app = express();


app.use(cors());
app.use(express.json());
await connectDB();


app.use("/api/user", userRouter)
app.use("/api/image", imageRouter)
app.get('/', (req, res) => {    
    res.send('API working perfectly');
} );


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));