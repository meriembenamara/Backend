const express = require("express");
//const { authenticateToken } = require("../Middlewares/auth"); // Importez directement authenticateToken de auth.js
const router = express.Router(); 
const { getAllUsers,getUserById, deleteUser, EnableUser, DisableUser, updateUser, getUserChats} = require("../Controllers/UserController"); 
const { LogIn, SignUp} = require("../Controllers/AuthController"); 
import { forget_password, reset_password } from "../Controllers/AuthController.js";

router.post("/SignUp",SignUp);
router.post("/LogIn",LogIn);
router.post('/forget-password', forget_password);
router.post('/reset-password', reset_password);

router.get("/AllUsers",getAllUsers); // Utilisez authenticateToken comme middleware pour cette route
//router.get("/:userId", authenticateToken ,getUserById);
router.get("/:userId" ,getUserById);


router.delete("/delete/:userId", deleteUser);
//router.put("/updateUser/:userId", //authenticateToken, updateUser); 
router.put("/updateUser/:userId",  updateUser); 

router.put("/Enable/:userId", EnableUser); 
router.put("/Disable/:userId", DisableUser); 

module.exports = router;
