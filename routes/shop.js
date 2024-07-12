const path = require('path');
const express = require('express');
const router = express.Router();

const shopController = require('../controller/shop');
const {isLoggedIn} = require('../middlewares/isLoggedIn');

router.get('/' ,shopController.getHome)

// router.get('/all-products', shopController.getAllProducts);
// router.get('/products/all' , shopController.getProductsAll);
router.get('/products/:id' ,shopController.getProductsById);

router.get('/cart' ,shopController.getCart);
router.get('/cart/add/:id', isLoggedIn,shopController.getAddToCartById);
router.get('/cart/increase/:id' ,shopController.getIncrease);
router.get('/cart/decrease/:id' ,shopController.getDecrease);
router.get('/cart/buy', shopController.getCartBuy);
router.get('/order/history', shopController.getOrderHistory);
router.get('/product/details/:id', shopController.getProductDetails);


module.exports = router;