
import { Router } from 'express'
import * as subCategoryController from './subCategory.controller.js' 
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import * as validators from './subCategory.validationSchemas.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
const router = Router({mergeParams:true})


router.post(
    '/add',
    multerCloudFunction(allowedExtensions.Image).single('SubCategoryImage'),
    validationCoreFunction(validators.createsubCategorySchema), 
    asyncHandler(subCategoryController.createSubCategory)
)
router.get(
    '/',
    asyncHandler(subCategoryController.getAllSubCategories)
)

export default router
