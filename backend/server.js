import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js'; 
import cookieParser from 'cookie-parser';
import {notFound, errorHandler} from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRouter.js'
import orderRoutes from './routes/orderRouter.js'
import uploadRoutes from './routes/uploadRoutes.js';
 
connectDB() //connects MongoDB
const port = process.env.PORT || 5000;

const app = express();

//Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

//Cookie Parser middleware
app.use(cookieParser())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) => 
res.send({clientId: process.env.PAYPAL_CLIENT_ID}))

//to access upload folder whch is created in root
const __dirname =path.resolve(); //set __dirname to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    // any route that is not api will be redirected to index.html
    app.get('*', (req,res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'bulid', index.html))
    )
} else{
    app.get('/', (req,res) => {
    res.send("API is running....!!")
});
}


app.use(notFound);
app.use(errorHandler);


app.listen(port, () => console.log(`Server is running in port ${port}`))