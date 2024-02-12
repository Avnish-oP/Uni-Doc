import express from 'express';
import {db, connectDB} from "./database/dbConfig.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import signupRoute from './routes/signupRoute.js';
import loginRoute from './routes/loginRoute.js';
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/signup", signupRoute);
app.use("/login", loginRoute);

process.on("exit", (code) => {
    db.end();
    console.log(`About to exit with code: ${code}`);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});