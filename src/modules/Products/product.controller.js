import slugify from "slugify"
import brandModel from "../../../DB/Models/brand.model.js"
import categoryModel from "../../../DB/Models/category.model.js"
import productModel from "../../../DB/Models/product.model.js"
import subCategoryModel from "../../../DB/Models/subCategory.model.js"
import cloudinary from "../../utils/coludinaryConfigrations.js"
import { customAlphabet } from 'nanoid'
import { paginationFunction } from "../../utils/pagination.js"
import { ApiFeatures } from "../../utils/apiFeatures.js"
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)

// =====================Add Product======================
export const addProduct=async(req,res,next)=>{
const {title,description,colors,sizes,stock,appliedDiscount,price}=req.body
const {brandId,subCategoryId,categoryId}=req.query
const exist =await productModel.findOne({title: title.toLowerCase()})
if(exist){
    return next (new Error("Product is already exist",{cause:400}))

}

const category=await categoryModel.findById(categoryId)
if(!category){
    return next (new Error("Wrong category id",{cause:400}))
}
const subCategory=await subCategoryModel.findById(subCategoryId)
if(!subCategory){
    return next (new Error("Wrong subCategory id",{cause:400}))
}
const brand=await brandModel.findById(brandId)
if(!brand){
    return next (new Error("Wrong brand id",{cause:400}))
}

const slug=slugify(title,{replacement:'_'})

const priceAfterDiscount=price*(1-(  ((appliedDiscount||0 )/100) ))  
// console.log(req.files);
// console.log(req.files.length);

if(!req.files.length){
    return next(new Error("Required fiels Image",{cause:400}))
}
const images=[]
const publicIds=[]
const customId=nanoid()
const productFolder=`${process.env.PROJECT_FOLDER}/Category/${category.customId}/SubCategory/${subCategory.customId}/Brand/${brand.customId}/products/${customId}`


for (const file of req.files) {
    const data=await cloudinary.uploader.upload(file.path,{
        folder:productFolder
    })
    const {secure_url,public_id}=data
    images.push({secure_url,public_id})
    publicIds.push(public_id)
}
req.imagePath=productFolder

const productObj={
    title,
    slug,
    description,
    colors,
    sizes,
    stock,
    appliedDiscount,
    price,
    priceAfterDiscount,
    brandId,
    subCategoryId,
    categoryId,
    images,
}
    const product =await productModel.create(productObj)
    req.productId=product._id
    return res.status(200).json({Message:"Done",product})
}


// =====================Get All Products=================
export const getAllProducts=async(req,res,next)=>{
    const {page,size}=req.query
    const {limit,skip}=paginationFunction({page,size})
    const products =await productModel.find().limit(limit).skip(skip)
    res.status(200).json({message:"Done",products})

}


// =====================Search Product===================
export const searchProduct=async(req,res,next)=>{
    const {page,size,searchKey}=req.query
    const {limit,skip}=paginationFunction({page,size})
    const products =await productModel
    .find({
            // title:searchKey
            // title: { $regex :searchKey,$options:'i'},
            $or:[
                {title: { $regex :searchKey,$options:'i'}},
                {description:{ $regex :searchKey,$options:'i'}}
            ]
        }
    ).limit(limit).skip(skip)
    res.status(200).json({message:"Done",products})

}


export const listProducts=async(req,res,next)=>{
    const ApiFeaturesInstance=new ApiFeatures(productModel.find({}),req.query)
    .pagination()
    .sort()
    .select()
    .filter()
    
    const products =await ApiFeaturesInstance.mongooseQuery
    
    res.status(200).json({message:"Done",products})

}