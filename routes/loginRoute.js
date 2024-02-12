import express from 'express';
import {db, connectDB} from "../database/dbConfig.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const router= express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
    const {email, password} = req.body;
    if (email.length === 0 || password.length === 0) {
        return res.status(400).json({message : "Please fill all the fields"});
    }
    try{
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({message : "User doesn't exist"});
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({message : "Invalid password"});
        }

        const token = jwt.sign({username: user.rows[0].username},"secretkey",{expiresIn:"1h"});
        res.status(200).json({token,user:user.rows[0]});
    } catch (err) {
        console.log("error in login",err);
        res.status(500).json({message : "Internal server error"});
    }
    });

export default router;
