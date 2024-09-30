import { Schema, model } from "mongoose";

const subCategorySchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        lowercase:true  
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true  
    },
    Images:{
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
    customId:{
        type:String,
    }
},{
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    timestamps:true,
})


subCategorySchema.virtual('Brands',{
    ref:'Brand',
    foreignField:'subCategoryId',
    localField:'_id'
})



const subCategoryModel=model('Subcategory',subCategorySchema)

export default subCategoryModel