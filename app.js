const express=require('express');
const app=express();

const bodyParser=require('body-parser');
const morgan=require('morgan');

const mongoose=require('mongoose');
const cors=require('cors');

const PORT=process.env.PORT || 7000
require('dotenv/config');
//const authJwt=require('./helpers/jwt');
//const errorHandler=require('./helpers/error-handler');

app.use(cors());
app.options('*',cors());
//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
//app.use(errorHandler());
//app.use(authJwt());

//Routes
const productsRouter=require('./routes/products');
const categoriesRouter=require('./routes/categories');
const ordersRouter=require('./routes/orders');
const usersRouter=require('./routes/users');


const api=process.env.API_URL;

app.use(`${api}/products`,productsRouter);
app.use(`${api}/categories`,categoriesRouter);
app.use(`${api}/orders`,ordersRouter);
app.use(`${api}/users`,usersRouter);

mongoose.connect('mongodb://127.0.0.1:27017/eshop-database')
.then(()=>{
    console.log("Database connection is ready");
})
.catch((err)=>{
    console.log(err);
})

// const connectDB=async()=>{
//     try{
//         await mongoose.connect('mongodb://127.0.0.1:27017/mydatabase',{
//             useNewUrlParser:true,
//             useUnifiedTopology:true
//         });
//         console.log("Connected to mongoDB")
//     }catch(error){
//         console.log(error);
//         process.exit(1);
//     }
// }
// connectDB();

app.listen(PORT,()=>{
    console.log('server is running http://localhost:7000');
})