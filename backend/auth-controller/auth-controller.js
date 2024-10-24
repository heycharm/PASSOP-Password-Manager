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
res.status(200).send('welcome to regsn page')
    }catch(error){
        res.status(400).send({msg:"page not found"})
    }
}

module.exports = {home, register}