import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow cookies and other credentials
}))
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: '10mb'}));
app.use(express.static('public'));


app.get('/health', (req,res)=>{
    res.status(200).json({message: 'Server is healthy'})    
})

app.use('/', router);

export default app;