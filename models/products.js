const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required: true
    },

    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }
})
productSchema.statics.search = function(query) {
    console.log("Searching for:", query); // Debug statement
    return this.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { category: new RegExp(query, 'i') },
      ],
    });
  };
module.exports = mongoose.model('products' , productSchema);