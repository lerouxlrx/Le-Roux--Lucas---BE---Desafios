const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");
const passport = require("passport");
const {generateToken, passportCall} = require("../utils/jsonwebtoken.js");
const cookieParser = require("cookie-parser");

//Login con JWT
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne ({email:email});
        if (!user){
            return res.status(400).send({message: "No se encuentra usuario, favor de registrarse."})
        }
        if (!isValidPassword(password, user)){
            return res.status(401).send({message: "La contraseña es incorrecta."})
        }

        const token = generateToken({
            first_name: user.first_name,
            last_name: user.last_name,
            age: user.age,
            email: user.email,
            role: "user"
        })
        res.cookie("tecommerceCookieToken", token, {maxAge: 60*60*1000, httpOnly: true}).redirect("/products");
    } catch (error) {
        console.log("Error en logueo", error)
        res.status(500).send({status:"error", message: "Error interno al loguearse."})
    }

})

router.get("/faillogin", async (req, res) => {
    res.send({error: "Error en el proceso del login"});
})

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) =>{})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async(req, res)=>{
    res.redirect("/products");
})

router.get("/current", passportCall("jwt"), (req, res) => {
    res.send(req.user);
  })

module.exports = router;