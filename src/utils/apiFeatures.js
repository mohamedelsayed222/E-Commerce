import { paginationFunction } from "./pagination.js"



export class ApiFeatures{
    constructor(mongooseQuery,queryData){
        this.mongooseQuery=mongooseQuery
        this.queryData=queryData
    }

    //pagination
    pagination(){
        const {page,size}=this.queryData
        const {limit, skip}=paginationFunction({page,size})
        this.mongooseQuery.limit(limit).skip(skip)
        return this
    }
    //sort 
    sort(){
        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',',' '))
        return this
    }
    //select
    select(){
        this.mongooseQuery.select(this.queryData.select?.replaceAll(',',' '))
        return this
    }
    //filter
    filter(){
        const queryInstance=this.queryData
        // console.log(queryInstance);
        const execludeKeysArr=['select','page','size','sort','search']
        execludeKeysArr.forEach((key)=>delete queryInstance[key])
        // console.log(queryInstance);
        const queryString=JSON.stringify(queryInstance).replace(
                    /gte|gt|lt|lte|eq|neq|regex|in|nin/g 
                    ,(match)=>`$${match}`)
        // console.log(queryString);
        const finalQuery=JSON.parse(queryString)
        // console.log(finalQuery)
        this.mongooseQuery.find(finalQuery)
        return this
    }

    //Search
    // search(){
    //     this.mongooseQuery.find(this.queryData.search)
    //     return this
    // }

}