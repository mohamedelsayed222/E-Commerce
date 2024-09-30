import { Router } from 'express'
const router = Router()
import * as brandController from './brand.controller.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import { multerCloudFunction } from '../../services/multerCloud.js'
import { allowedExtensions } from '../../utils/allowedExtensions.js'


router.post('/',
multerCloudFunction(allowedExtensions.Image).single('BrandImage'),
asyncHandler(brandController.addBrand))

export default router
