const express = require("express")
const router = express.Router();
const app =express()
// const {home, register} =require("../auth-controller/auth-controller")
const authcontrollers =require("../auth-controller/auth-controller")

// app.get("/", (req, res)=>{
// res
// .status(200)
// .send("welcome to world best mern")
//      })
router.route("/").get(authcontrollers.home)
router.route("/registration").post(authcontrollers.register)

     module.exports=router;