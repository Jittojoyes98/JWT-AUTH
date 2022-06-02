const mongoose=require('mongoose')

const databaseConnect=async()=>{
    try{
        await mongoose.connect('mongodb+srv://jitto:Livingking_7@mern-practice.koafg.mongodb.net/test')
        console.log("Connected to database")
    }catch(err){
        console.error(err)
    }    
}
module.exports=databaseConnect;