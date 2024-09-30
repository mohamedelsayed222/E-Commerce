import { Schema, model } from "mongoose";

const productSchema=new Schema({
    title:{
        type:String,
        required:true,
        lowercase:true
    },
    description:{
        type:String,
    },
    slug:{
        type:String,
        required:true,
        lowercase:true

    },
    colors:[{
        type:String,
    }],
    sizes:[{
        type:String,
    }],
    price:{
        type:Number,
        required:true,
        default:1,
    },
    appliedDiscount:{
        type:Number,
        default:0,
    },
    priceAfterDiscount:{
        type:Number,
        default:0,
    },
    stock:{
        type:Number,
        required:true,
        default:1,
    },
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true     
    },
    subCategoryId:{
        type:Schema.Types.ObjectId,
        ref:"Subcategory",
        required:true   
    },
    brandId:{
        type:Schema.Types.ObjectId,
        ref:"Brand",
        required:true     
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:false          //todo    
    },
    updatedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",  
    },
    deletedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",  
    },
    customId:{
        type:String,
    },
    images:[{
        secure_url:{
            type:String,
            required:true,
        },
        public_id:{
            type:String,
            required:true
        },
    }]

},{
    timestamps:true
})


const  productModel= model('Product',productSchema)
export default productModel