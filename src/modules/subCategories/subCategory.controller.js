import subCategoryModel from "../../../DB/Models/subCategory.model.js"
import categoryModel from '../../../DB/Models/category.model.js'
import cloudinary from "../../utils/coludinaryConfigrations.js"
import slugify from "slugify"
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

//===========================create subCategory API=================
export const createSubCategory=async (req,res,next)=>{
    const {name}=req.body
    const {categoryId}=req.params
    if(!name){
        return next (new Error("The name is required",{cause:400}))
    }
    if(!categoryId){
        return next (new Error("The category id is required",{cause:400}))
    }
    if(!req.file){
        return next (new Error("The subCategory Image is required",{cause:400}))
    }
    const category=await categoryModel.findById(categoryId)
    if(!category){
        return next (new Error("Wrong category id",{cause:400}))
    }
    if(await subCategoryModel.findOne({name})){
        return next (new Error("The name is already exist dublicate name",{cause:400}))
    }
    const slug=slugify(name,'_')
    const customId=nanoid()
    const data=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.PROJECT_FOLDER}/Category/${category.customId}/SubCategory/${customId}`
    })
    const {secure_url,public_id}=data
    const subCategory=await subCategoryModel.create({
        name,
        slug,
        Images:{secure_url,public_id},
        categoryId,
        customId
    })

    if(!subCategory){
        await cloudinary.uploader.destroy(public_id)
        return next (new Error("Eror try again in few seconds ",{cause:404}))
    }
    return res.status(201).json({message:"Created Done", subCategory})




}


export const getAllSubCategories =async (req,res,next)=>{

    const allSubCategories=await subCategoryModel.find().populate([{
        path:'categoryId',
        select:'slug name createdAt'
    }])
    return res.status(200).json({message:"Done",allSubCategories})
}

