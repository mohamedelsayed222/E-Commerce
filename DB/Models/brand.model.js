import { Schema, model } from "mongoose";

const brandSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        lowercas:true  
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercas:true  
    },
    logo:{
        secure_url:{
            type:String,
            required:true,
        },
        public_id:{
            type:String,
            required:true
        }
    , 
    },
    created_by:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:false     // TO_DO  Transform to true when user model is created
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
    customId:{
        type:String,
    }


},{
    // toObject:{virtuals:true},
    // toJSON:{virtuals:true},
    timestamps:true,
})


const brandModel=model('Brand',brandSchema)

export default brandModel