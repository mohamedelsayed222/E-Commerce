import { Router } from "express";
import * as productController from './product.controller.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { validationCoreFunction } from "../../middlewares/validation.js";
import * as validators from './product.validation.js'


const router=Router()


router.post('/add',
        multerCloudFunction(allowedExtensions.Image)
        .array("ProductImages",2),
        validationCoreFunction(validators.addProductSchema),
    asyncHandler(productController.addProduct))
router.get("/",asyncHandler(productController.getAllProducts))
router.get("/search",asyncHandler(productController.searchProduct))
router.get("/list",asyncHandler(productController.listProducts))





export  default router ;