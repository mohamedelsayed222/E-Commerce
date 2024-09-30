import productModel from "../../DB/Models/product.model.js";
import cloudinary from "./coludinaryConfigrations.js";

export const asyncHandler = (API) => {
  return (req, res, next) => {
     API (req, res, next).catch( async (err) => {
      // console.log(err)
      // console.log(req.imagePath);
      if(req.imagePath){
        await cloudinary.api.delete_resources_by_prefix(req.imagePath)
        await cloudinary.api.delete_folder(req.imagePath)
      }
      // console.log(req.productId);
      if(req.productId){
      await productModel.findByIdAndDelete(req.productId,{new:true})
      }
      return next(new Error(err,{cause:500}))
    }
  )
  }
}

export const globalErrorHandling = (err, req, res, next) => {
  if (err) {
    return res.status(err['cause'] || 400).json({
       message:err.message,err,stack:err.stack
      })
  }
}
