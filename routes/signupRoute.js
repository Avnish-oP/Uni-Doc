import express from 'express';
import {db, connectDB} from "../database/dbConfig.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


const router = express.Router();
router.use(express.json());


router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (username.length === 0 || email.length === 0 || password.length === 0) {
            return res.status(400).send("Please fill all the fields");
        }
        const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({message : "User already exists"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await db.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", [username, email, hashedPassword]);
        const token = jwt.sign({username : result.rows[0].username}, "secret", {expiresIn : "1h"});
        

        res.status(200).json({token,user:result.rows[0]});
    } catch (err) {
        console.log("error in sending data to db",err);
        res.status(500).json({message : "Internal server error"});
    }
    
});

export default router;