const express = require("express");
//const { authenticateToken } = require("../Middlewares/auth"); // Importez directement authenticateToken de auth.js
const router = express.Router(); 
const { ResetPassword,UpdatePassword,getAllUsers,getUserById, deleteUser, EnableUser, DisableUser, updateUser, getUserChats} = require("../Controllers/UserController"); 
const { LogIn, SignUp} = require("../Controllers/AuthController"); 

router.post("/SignUp",SignUp);
router.post("/LogIn",LogIn);
router.post("/UpdatePassword",UpdatePassword);
router.post("/ResetPassword",ResetPassword);

router.get("/AllUsers",getAllUsers); // Utilisez authenticateToken comme middleware pour cette route
//router.get("/:userId", authenticateToken ,getUserById);
router.get("/:userId" ,getUserById);


router.delete("/delete/:userId", deleteUser);
//router.put("/updateUser/:userId", //authenticateToken, updateUser); 
router.put("/updateUser/:userId",  updateUser); 

router.put("/Enable/:userId", EnableUser); 
router.put("/Disable/:userId", DisableUser); 

module.exports = router;
