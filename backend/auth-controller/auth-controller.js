const home = async(req, res) =>{
try{
    res.status(200)
    .send(
        "welcome to mern app"
    )

}catch(error){
    console.log(error)
}
}

//REGISTRATION LOGIC
const register = async(req,res)=>{
    try{
        console.log(req.body)
res.status(200).json({message:req.body})
    }catch(error){
        res.status(400).json("page not found")
    }
}

module.exports = {home, register}