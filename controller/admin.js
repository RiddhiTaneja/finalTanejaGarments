const { trusted } = require('mongoose');
const Products = require('../models/products');
const { isAdmin } = require('../middlewares/isAdmin');


module.exports.getAdminHome =(req,res, next)=>{
    res.render('admin/home' ,{
        isAdmin:true,
        isLoggedIn:true

    });

   
 }

    module.exports.getProductsAdd = (req, res , next) =>{
    res.render('admin/add-product',{
        isAdmin:true
    })
        }

        module.exports.getProductsUpdate= async(req,res,next)=>{
            const{ id } = req.params;
            try{
                const product = await Products.findById(id);
                res.render('admin/update-products',{
                    isAdmin:true,
                    isLoggedIn:true
                })
        
            }
            catch(err){
                next(err);
        
            }
                }
                module.exports.getProductsAll = async (req, res , next) =>{
                    const  products = await Products.find();
                    console.log(products);
                    let data ={};
                    products.forEach(product =>{
                        let arr = data[product.category] || [];
                        arr.push(product);
                        data[product.category] = arr;
                    });
                    //res.send(data);
                    res.render('admin/products-list',{
                        products:data
                    })
                    }


  module.exports.getProductsUpdate= async(req,res,next)=>{
    const{id} = req.params;
    try{
        const product = await Products.findById(id);
        res.render('admin/update-products',{
            product,
            isAdmin:true,
            isLoggedIn:true
        });

    }
    catch(err){
        next(err);

    }
        }
        module.exports.postProductsAdd = async (req, res , next) =>{
            const {name , price , description , imageUrl , category} = req.body;
            //console.log(name , price , description );
            try{
            await Products.create({
                name , 
                price,
                description,
                imageUrl,
                category,
            isAdmin:true,
            isLoggedIn:true
                    });   
            
            res.redirect('/admin/products/all')
            }
            
            catch(err){
                res.send(err)
            }
            }
            
            module.exports.postProductsUpdate = async (req,res,next)=>{
                const {name,price,description,imageUrl,id, category} = req.body;
                try{
                    let p = await Products.findById(id);
                    p.name = name;
                    p.price= price;
                    p.description = description;
                    p.imageUrl = imageUrl;
                  
                    p.category = category;
                    await p.save();
    
                    res.redirect('/admin/products/all');
                }
                catch(err){
    
                    res.send(err)
                }
            }

            module.exports.getDeleteProductById =async (req, res,next) =>{
                const{ id } = req.params;
                try{
                    let p = await Products.deleteOne({ _id:id });
                    //await p.save();
            
                    res.redirect('/admin/products/all',{
                        isAdmin:true,
                        isLoggedIn:true
                    });
                }
                catch(err){
            
                    res.send(err)
                }
              }
            