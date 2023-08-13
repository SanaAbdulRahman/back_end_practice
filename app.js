const express=require('express');
const app=express();

const bodyParser=require('body-parser');
const morgan=require('morgan');

const mongoose=require('mongoose');
const cors=require('cors');
const path=require('path')
const ejs=require('ejs')
const cookieParser=require('cookie-parser');
//const flash=require('express-flash');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const PORT=process.env.PORT || 7000
require('dotenv/config');
//const authJwt=require('./helpers/jwt');
//const errorHandler=require('./helpers/error-handler');

// Configure session middleware with MongoDB session store
const store = new MongoStore({
    uri: 'mongodb://127.0.0.1:27017/user-auth',
    collection: 'sessions'
  });
  app.use(cookieParser());
  app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    store: store
  }));
//app.use(flash());
app.use(cors());
app.options('*',cors());
//middleware
// Parse request bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
//middleware
app.use(morgan('tiny'));
app.use(express.static('public'))
//app.use(errorHandler());
//app.use(authJwt());
 // Set EJS as the view engine
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));
//Routes
const productsRouter=require('./routes/products');
const categoriesRouter=require('./routes/categories');
const ordersRouter=require('./routes/orders');
const usersRouter=require('./routes/users');
const adminRouter=require('./routes/admin');


const api=process.env.API_URL;

app.use(`${api}/products`,productsRouter);
app.use(`${api}/categories`,categoriesRouter);
app.use(`${api}/orders`,ordersRouter);
app.use(`${api}/users`,usersRouter);
app.use(`${api}/`,adminRouter);

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