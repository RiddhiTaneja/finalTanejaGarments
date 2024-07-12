const { isAdmin} = require('../middlewares/isAdmin');
const {isLoggedIn} = require('../middlewares/isLoggedIn');
const Products = require('../models/products');
const Users = require('../models/user');
const Category = require('../models/category');

module.exports.getProductsById = async (req, res, next) => {
    const category = req.query.category;
    const limit = parseInt(req.query.limit) || 4;
    try {
        const { id } = req.params;
        let product = await Products.findOne({ _id: id }).limit(limit);
        res.render('shop/product-details', {
            product: product,
            isLoggedIn:true ,
            isAdmin:(req.user.role =='admin')?true:false
        })

    } catch (err) {
        next(err);
    }
}

module.exports.getHome = async (req, res, next) => {
    try {
        let products = await Products.find({});
        const { getProductsCategoryWise } = require('../utils/library');
        let categoryProducts = getProductsCategoryWise(products);

        res.render('shop/home', {
            products: categoryProducts,
            isLoggedIn:true,
            isAdmin:(req.user.role =='admin')?true:false
        })
    } catch (err) {

    }
}


module.exports.getAddToCartById = async (req, res, next) => {
    try {
        const { id } = req.params;
        let cart = req.user.cart;
        let indx = -1;
        cart.forEach((item, i) => {
            if (item.id == id) {
                indx = i;
            }
        })
        if (indx == -1) {
            cart.unshift({
                id: id,
                quantity: 1
            })
        }
        else {
            cart[indx].quantity++;
        }

        // To make sure that db mei changes ho jaaye we need to save it
        req.user.save();
        res.redirect('/shop/cart');
    } catch (err) {
        next(err);
    }
}

module.exports.getCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        let user = await Users.findOne({ _id: req.user._id }).populate('cart.id');

        console.log(user.cart);
        let totalPrice = 0;
        user.cart.forEach((item) => {
            totalPrice += item.id.price * item.quantity;
        })
        res.render('shop/cart', {
            cart: user.cart,
            totalPrice,
            isLoggedIn:true,
            isAdmin:(req.user.role =='admin')?true:false
        });
    } catch (err) {
        next(err);
    }
}


module.exports.getIncrease = async (req, res, next) => {
    const { id } = req.params;
    let cart = req.user.cart;
    let indx;
    cart.forEach((item, i) => {
        if (item.id == id) {
            indx = i;
        }
    })

    cart[indx].quantity++;
    await req.user.save();
    try {
        let user = await Users.findOne({ _id: req.user._id }).populate('cart.id');
        let totalPrice = 0;
        user.cart.forEach((item) => {
            totalPrice += item.id.price * item.quantity;
        })
        res.send({
            id: user.cart,
            totalPrice,
            isAdmin:(req.user.role =='admin')?true:false
        });
    } catch (err) {
        next(err);
    }

}


module.exports.getDecrease = async (req, res, next) => {
    const { id } = req.params;
    let cart = req.user.cart;
    let indx;
    cart.forEach((item, i) => {
        if (item.id == id) {
            indx = i;
        }
    })
    // if(indx != -1){
    if (cart[indx].quantity > 1){
        cart[indx].quantity--;
  //  console.log(cart);
    }
     else{ //(cart[indx].quantity == 1){}
        cart.splice(indx, 1);
     }
     
    await req.user.save();
    try {
        let user = await Users.findOne({ _id: req.user._id }).populate('cart.id');
        let totalPrice = 0;
        user.cart.forEach((item) => {
            totalPrice += item.id.price * item.quantity;
        })
        res.send({
            id: user.cart,
            totalPrice,
            isAdmin:(req.user.role =='admin')?true:false
        });
    } catch (err) {
        next(err);
    }
}


module.exports.getCartBuy = async (req, res, next) => {
    try {
        let user = await Users.findOne({ _id: req.user._id }).populate('cart.id');
        let cart = user.cart; //user ki cart nikali
        let myOrder = req.user.orders ||[];     
        console.log("Before",myOrder);
        // let newOrder = cart.map(async(item )=> {    
        //     let order = {};
        //     let product = await Products.findOne({_id:item.id});
        //     order.product = product;
        //     order.quantity = item.quantity;
        //     order.price = order.product.price * order.quantity;
        //     return order;
        // })
    let newOrder =[]; 
        for(let i = 0 ; i< cart.length;i++){
            const item = cart[i]
            let order = {};
            //let product = item.id;
             let product = await Products.findOne({_id:item.id});
            order.product = product;
                order.quantity = item.quantity;
                order.price = order.product.price * order.quantity;
        console.log('Order' ,order);
        newOrder.push(order);
            }
            newOrder.forEach((item)=>{
                myOrder.push(item);
    
            })
        await Users.updateOne({
            _id: req.user._id
        }, {
            orders: myOrder,
            cart: []
        })
        res.redirect('/shop/order/history')
         // console.log("NEW ORDER",newOrder);
        //  req.user.cart=[];
        // await req.user.save();
        // console.log(myOrder[0]);
        // console.log(req.user.orders);
        // res.send({
        //     message: "Order placed successfully",
        //     myOrder,
        //     cart
        // })
    } catch (err) {
        next(err);
    }
}




module.exports.getOrderHistory = (req, res, next) => {
    try {
        let orders = req.user.orders;
        // res.send(orders);
    res.render('shop/order',{
        orders,
        isLoggedIn:true
    })
    } catch (err) {

    }
}

module.exports.getProductDetails = async (req, res, next) => {
    try {
        let product = await Products.findById(req.params.id);
        res.render('shop/product', {
            product,
            isLoggedIn: true
        })
    }
    catch (err) {
        next(err);
    }
}

