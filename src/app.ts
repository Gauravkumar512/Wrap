import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from './routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

app.use(cors({
    origin: '*',
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '10mb'}));
app.use(express.static('public'));


app.get('/health', (req,res)=>{
    res.status(200).json({message: 'Server is healthy'})    
})

app.use('/', router);

app.use(errorHandler)

export default app;