import userModel from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body)
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = await userModel.create(userData);
        const user = await newUser.save();
        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn : 3600});

        res.status(201).json({success : true , token, user : {id : user._id, name : user.name, email : user.email}});
    } catch (error) {
            console.log(error);
            res.json({success : false, message : error.message});  
    }
}



const loginUser = async (req, res) => {
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({message : "Please fill all fields"});
        }

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success : false, message : "User does not exits"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch) {
            const token = jwt.sign({id : user._id}, process.env.JWT_SECRET);

            res.json({success : true, token, user : {name : user.name, email : user.email}})
        }
        else {
            return res.status(400).json({success : false, message : "Invalid credentials"})
        }


    } catch (error) {
        console.log(error);
        res.json({success : false, message : error.message})
    }
}



const userCredits = async (req, res)=> {
    try {
        const {userId} = req.body; 
        console.log(userId)
        const user = await userModel.findById(userId)
        console.log("user" + user)
        res.send({success : true , credits : user.creditBalance , user : {name : user.name}})
    } catch (error) {
        console.log(error);
        res.json({success : false, message : error.message})
    }
}


export { registerUser, loginUser, userCredits };