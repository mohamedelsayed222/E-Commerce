
import slugify from "slugify";
import cloudinary from "../../utils/coludinaryConfigrations.js";
import categoryModel from "../../../DB/Models/category.model.js";
import subCategoryModel from "../../../DB/Models/subCategory.model.js";
import brandModel from "../../../DB/Models/brand.model.js";
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

//====================== Create Category API=============
export const createCategory=async(req,res,next)=>{
    const {name}=req.body;
    const slug=slugify(name,'_')
    console.log(slug);

    if(await categoryModel.findOne({name})){
        return next(new Error('The category already exist',{cause:400}))
    }

    if(!req.file){
        return next(new Error('A Category image is reqired',{cause:400}))
    }

    const customId=nanoid()

    const data=await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.PROJECT_FOLDER}/Category/${customId}`
    })

    const {public_id,secure_url}=data
    const category=await categoryModel.create({
        name,
        slug,
        customId,
        Images:{public_id,secure_url}})

    if(!category){
        await cloudinary.uploader.destroy(public_id)
        return next(new Error('Not created Try again later',{cause:500}))
    }

    return res.status(201).json({message:'Done',category})
}

//====================== Update Category API=============

export const updateCategory=async(req,res,next)=>{
    const {name}=req.body;
    // name =name.toLowerCase()   // ERRRRRRRRRRRRROR  
    const {categoryId}=req.params
    const category=await categoryModel.findById(categoryId)
    if(!category){
        return next(new Error('There is no category hold that id ',
        {cause:400}))
    }
    if(name){
        //1
        if(category.name==name.toLowerCase()){
            return next(new Error('Please enter differnt name to update',
            {cause:400}))
        }
        //2
        if(await categoryModel.findOne({name})){
            return next(new Error('The category already exist dublicate names ',
            {cause:400}))
        }

        category.name=name
        const slug=slugify(name,'_')
        category.slug=slug
    }
    if(req.file){
        await cloudinary.uploader.destroy(category.Images.public_id)
        const data=await cloudinary.uploader.upload(req.file.path,{
            folder:`${process.env.PROJECT_FOLDER}/Category/${category.customId}`
        })
        const {public_id,secure_url}=data
        category.Images={public_id,secure_url}
    }
    await category.save()
    return res.status(201).json({message:'Updated Done',category})
}

//====================== get Categories API=============


export const getAllCategories =async (req,res,next)=>{
    let allCategories=[]

    //     for(const category of await categoryModel.find()){
    //     const subCategories=await subCategoryModel.find({categoryId:category._id})
    //     const categoryObj=category.toObject()
    //     categoryObj.subCategories=subCategories
    //     allCategories.push(categoryObj) 
    // }
    // const cursor = categoryModel.find().cursor();
    // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    //     const subCategories=await subCategoryModel.find({categoryId:doc._id})
    //     const categoryObj=doc.toObject()
    //     categoryObj.subCategories=subCategories
    //     allCategories.push(categoryObj) 
    // }
    // return res.status(200).json({message:"Done",allCategories})
    
const categories = await categoryModel.find().populate([
    {
        path:'SubCategories',
        select:'name',
        populate:[{
            path:"Brands",
            select:'name',
        }]
    }
])
return res.status(200).json({message:"Done",categories})
}


//====================== deleteCategory API=============

export const deleteCategory=async(req,res,next)=>{
   
    const {categoryId}=req.query
    const  category=await categoryModel.findByIdAndDelete(categoryId)
    if(!category){
        return next(new Error('There is no category hold that id ',
        {cause:400}))
    }
    await cloudinary.uploader.destroy(category.Images.public_id)

    const subCategories=await subCategoryModel.deleteMany({categoryId})
    if(!subCategories.deletedCount){
        return next(new Error('Deleted subCategeroies failed ',
        {cause:400}))
    }
    const brands =await brandModel.deleteMany({categoryId})  
    if(!brands.deletedCount){
        return next(new Error('Deleted Brands failed ',
        {cause:400}))
    }

        await cloudinary.api.delete_resources_by_prefix(
            `${process.env.PROJECT_FOLDER}/Category/${category.customId}`)
        await cloudinary.api.delete_folder(
            `${process.env.PROJECT_FOLDER}/Category/${category.customId}`)

        return res.status(201).json({message:'Deleted Done'})
}

