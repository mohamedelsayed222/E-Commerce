import joi from 'joi'


export const createsubCategorySchema={
    body:joi.object({
        name:joi.string().min(4).max(25),
    }).required().options({allowUnknown:false,presence:'required'})
}

// export const updateCategorySchema={
//     body:joi.object({
//         name:joi.string().min(4).max(15).optional(),
//     }).required()
// }