import { Router } from 'express'
import * as categoryController from './category.contoller.js' 
import { asyncHandler } from '../../utils/errorhandling.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'
import * as validators from './category.validationSchemas.js'
import { validationCoreFunction } from '../../middlewares/validation.js'
import subCategoryRouter from '../subCategories/subCategory.routes.js' 
const router = Router()



router.get(
    '/',
    asyncHandler(categoryController.getAllCategories)
)




router.use('/:categoryId',subCategoryRouter)
router.post('/',
multerCloudFunction(allowedExtensions.Image).single("CategoryImage")
,validationCoreFunction(validators.createCategorySchema)
,asyncHandler(categoryController.createCategory))
router.put('/:categoryId',
multerCloudFunction(allowedExtensions.Image).single("CategoryImage")
,validationCoreFunction(validators.updateCategorySchema)
,asyncHandler(categoryController.updateCategory))
router.delete('/delete',
asyncHandler(categoryController.deleteCategory))




export default router
