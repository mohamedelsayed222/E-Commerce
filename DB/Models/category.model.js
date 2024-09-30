import { Schema, model } from "mongoose";

const categorySchema=new Schema({
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
     customId:{
        type:String,
     }


},{

    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    timestamps:true
})


categorySchema.virtual('SubCategories',{
    ref:'Subcategory',
    foreignField:'categoryId',
    localField:'_id'
})

const categoryModel=model('Category',categorySchema)

export default categoryModel