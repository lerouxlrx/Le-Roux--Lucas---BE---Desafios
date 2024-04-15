const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcryp.js");
const passport = require("passport");
const {generateToken} = require("../utils/jsonwebtoken.js");

//Register con JWT
router.post("/", async (req, res) => {
    const {first_name, last_name, age, email,password} = req.body;

    try {
        const emailValidation = await UserModel.findOne({email:email});

        if(emailValidation){
            return res.status(400).send({error:"El email ya tiene usuario asociado."});
        }

        const newUser = await UserModel.create({first_name, last_name, age, email,password: createHash(password)})

        const token = generateToken({id: newUser._id})

        res.cookie("tecommerceCookieToken", token, {maxAge: 60*60*1000, httpOnly: true}).redirect("/products");
    } catch (error) {
        console.log("Error en registro", error)
        res.status(500).send({status:"error", message: "Error interno al registrarse."})
    }
})

router.get("/failedregister", (req, res) => {
    res.send({error: "No se pudo registrar el usuario"});
})

module.exports = router; 