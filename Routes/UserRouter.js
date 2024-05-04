const express = require("express");
const router = express.Router(); 
const { LogIn, SignUp,ResetPassword,UpdatePassword,getAllUsers,getUserById, deleteUser, EnableUser, DisableUser, updateUser } = require("../Controllers/UserController"); 


router.post("/SignUp",SignUp);

router.post("/LogIn", LogIn);

router.post('/UpdatePassword',UpdatePassword);

router.post('/ResetPassword',ResetPassword);

router.get("/AllUsers", getAllUsers);
router.get("/:userId", getUserById);
router.delete("/delete/:userId",deleteUser);
router.put("/updateUser/:userId", updateUser); 
router.put("/Enable/:userId", EnableUser); 
router.put("/Disable/:userId", DisableUser); 
module.exports = router;



