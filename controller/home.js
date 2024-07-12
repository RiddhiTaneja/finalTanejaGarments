
const Products = require('../models/products');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Users = require('../models/user');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const { isAdmin } = require('../middlewares/isAdmin');
const products = require('../models/products');

module.exports.getLogin = (req,res,next)=>{
    // if(req.isAuthenticated()) return res.redirect('/profile');
    res.render('login');
}

module.exports.getHome = async(req,res,next)=>{
    // if(!req.isAuthenticated()) return res.redirect('/login');
    // else
    try{
        let products = await Products.find();
        const {getProductsCategoryWise} = require('../utils/library');
        products = getProductsCategoryWise(products);
        // const isLoggedIn = req.isAuthenticated();
        // const isAdmin = req.user && req.user.role === 'admin';
        res.render('index',{
            products,
            // isAdmin:(req.user.role ==='admin')?true:false,
            isLoggedIn: true
        });
    }
    catch(err){
        next(err);
    }
}

module.exports.getSignup= (req,res,next)=>{
    if(req.isAuthenticated()) return res.redirect('/profile');
    res.render('signup');
};


module.exports.postSignup = async (req,res,next)=>{
    const {username,password} = req.body;
    try {
       let user = await Users.findOne({username});
        if(user){
            return res.render('signup',{
                msg: "This username already exists try another one"
            })
        }

        bcrypt.hash(password, saltRounds,async function(err, hash) {
           
            // Store hash in your password DB.
    try{
            user = await Users.create({
                username,
                password : hash
    
            });
            res.redirect('/login');
        }catch(err){
         return res.status("500").json("Can not create a user right now");
       }
        });

    } catch (err) {
        next(err);
    }
}
module.exports.search = async (req, res) => {
    const { getProductsCategoryWise } = require('../utils/library');
    try {
        const query = req.query.q;
        console.log("Search query:", query); // Debug statement
    
        const product = await products.search(query);
        console.log("Search results:", product); // Debug statement
    
        const categorizedProducts = getProductsCategoryWise(product);
        console.log("Categorized products:", categorizedProducts); // Debug statement
    
        res.render('searchResults', { product: categorizedProducts });
      } catch (error) {
        console.error("Error during search:", error);
        res.status(500).send(error);
      }
    }
 
