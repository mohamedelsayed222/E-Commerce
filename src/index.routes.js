
import { connectDB } from '../DB/connection.js'
import { globalErrorHandling } from './utils/errorhandling.js'
import  categoryRouter   from './modules/Categories/category.routes.js'
import  subCategoryRouter from './modules/subCategories/subCategory.routes.js'
import  brandRouter  from './modules/Brands/brand.routes.js'
import  productRouter from './modules/Products/product.router.js'



 const bootstrap=(app,express)=>{
    app.use(express.json())
    app.use('/category',categoryRouter)
    app.use('/subCategory',subCategoryRouter)
    app.use('/brand',brandRouter)
    app.use('/product',productRouter)
    app.get('/', (req, res) => res.send('Hello World!'))
    app.get("*",(req,res,next)=>{
        res.send("Page Not found")
    })
    app.use(globalErrorHandling)
    connectDB()

}
export default bootstrap