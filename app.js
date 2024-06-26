const path = require('path');
const express = require('express');
const app = express();
const PORT= process.env.PORT;
const mongoose = require('mongoose');
const hbs = require('hbs');
const User = require('./models/user');

// app.use(async (req,res,next)=>{
//     let user = await User.findOne({
//         _id: "665466acb41763b50e46b79d"
//     });
//     req.user = user;
//     next();
// })

const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config()

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: process.env.CLOUDMONGOOSE_URL})
}))


const passport = require('./authentication/passport');
app.use(passport.initialize());
app.use(passport.session());

// console.log('Google Client ID:', process.env.GOOGLE_CLIENTID);
//  console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);

app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine' ,'hbs');
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

const homeRouter = require('./routes/home');
app.use('/', homeRouter);

const adminRouter = require('./routes/admin');
const{isAdmin} = require('./middlewares/isAdmin');
app.use('/admin' ,isAdmin, adminRouter);

const shopRouter = require('./routes/shop');
const{isLoggedIn} = require('./middlewares/isLoggedIn');
app.use('/shop',isLoggedIn ,shopRouter);


mongoose.connect(process.env.CLOUDMONGOOSE_URL).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('http://localhost:'+process.env.PORT);
    
    });
})

.catch(err=>{
    console.log(err)
})
module.exports = app;