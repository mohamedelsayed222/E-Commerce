import brandModel from "../../../DB/Models/brand.model.js"
import categoryModel from "../../../DB/Models/category.model.js"
import subCategoryModel from "../../../DB/Models/subCategory.model.js"
import slugify from "slugify"
import { customAlphabet } from 'nanoid'
import cloudinary from "../../utils/coludinaryConfigrations.js"
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)



export const addBrand=async (req,res,next)=>{
    const {name}=req.body
    const {categoryId,subCategoryId}=req.query
    if(!name){
        return next (new Error("The name is required",{cause:400}))
    }
    if(!categoryId){
        return next (new Error("The category id is required",{cause:400}))
    }
    if(!subCategoryId){
        return next (new Error("The subCategory id is required",{cause:400}))
    }
    if(!req.file){
        return next (new Error("The Brand Logo is required",{cause:400}))
    }

    const category=await categoryModel.findById(categoryId)
    if(!category){
        return next (new Error("Wrong category id",{cause:400}))
    }
    const subCategory=await subCategoryModel.findById(subCategoryId)
    if(!subCategory){
        return next (new Error("Wrong subCategory id",{cause:400}))
    }
    if(await brandModel.findOne({name})){
        return next(new Error('The brand  already exist',{cause:400}))
    }
    const slug=slugify(name,
    {
        replacement:'_',
        lower:true
    })
    const customId=nanoid()
    const data=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.PROJECT_FOLDER}/Category/${category.customId}/SubCategory/${subCategory.customId}/Brand/${customId}`
    })
    const {secure_url,public_id}=data
    const brand=await brandModel.create({
        name,
        slug,
        logo:{secure_url,public_id},
        categoryId,
        subCategoryId,
        customId
    })
    if(!brand){
        await cloudinary.uploader.destroy(public_id)
        return next (new Error("Eror try again in few seconds ",{cause:404}))
    }
    return res.status(201).json({message:"Created Done", brand})

}
