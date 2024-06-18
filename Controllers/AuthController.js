// Importing the User model from "../Models/UserModel"
const User = require("../Models/UserModel");
const Admin = require("../Models/AdminModel");
const jwt = require("jsonwebtoken");
const {AUTH_SECRET} = require("../Middlewares/auth")
//const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
import {generateVerificationCode, SendEmailResetPassword } from "./SendEmail.js"

const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= minLength;

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength;
};


const SignUp = async(req,res) => {
    try {
        const { First_name, name, email, selectedRole, num_tel, address, password, conf_password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        if (password !== conf_password) {
            return res.json({ success: false, message: "Les mots de passe ne correspondent pas" });
        }

        if (!validatePassword(password)) {
            return res.json({ success: false, message: "Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial" });
        }

        const existingUser = await User.findOne({ email }); // Vérifier si l'utilisateur existe déjà

        if (existingUser) {
            return res.json({ success: false, message: "L'utilisateur existe déjà" });
        }

        const newUser = new User({
            First_name,
            name,
            email,
            selectedRole,
            num_tel,
            address,
            password: hashedPassword ,
            conf_password
           // role
        });

    await newUser.save();

    // Renvoi de la réponse avec le jeton JWT
    res.json({ success: true, message: "Inscription réussie",newUser });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Une erreur est survenue lors de l'inscription" });
    }
};


const LogIn = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Recherchez l'utilisateur dans la base de données
      const user = await User.findOne({ email });
      const admin = await Admin.findOne({ email });

      // Vérifiez si l'utilisateur existe
      if (!user && !admin) {
          return res.json({ message: "Utilisateur non trouvé" });
      }

      // Vérifiez si le mot de passe est correct
      //if (user.password !== password) {
        //  return res.json({ message: "Mot de passe incorrect" });
      //}

      const account = user || admin;
      const isMatch = await bcrypt.compare(password, account.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Vérifiez si le compte est activé
      if (!user.isEnabled) {
          return res.json({ message: "Compte désactivé. Veuillez contacter l'administrateur." });
      }

      // Génération du jeton JWT
     // const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

     const token = jwt.sign(
        { id: account._id, email: account.email, role: user ? 'user' : 'admin' },
        AUTH_SECRET,
        { expiresIn: '1h' }
      );

      // Renvoi de la réponse avec le jeton JWT
      return res.json({ success: true, message: "Connexion réussie", user, token });

  } catch (error) {
      console.error("Erreur de connexion:", error);
      return res.status(500).json({ message: "Une erreur est survenue lors de la connexion" });
  }
};


// forget password section //
export const forget_password = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      // Check if user exists
      if (!user) {
        return res.status(400).json({ message: 'Email not found' });
      }
  
      // Generate verification code, expiration time, and assign to user object
      const forgetPasswordCode = generateVerificationCode();
      const passwordResetExpires = Date.now() + 3600000; // 1 hour expiration
  
      user.forget_password_code = forgetPasswordCode;
      user.passwordResetExpires = passwordResetExpires;
  
      await user.save();
      await SendEmailResetPassword(user.email, forgetPasswordCode, user.First_name);
  
      res.json({ message: 'Password reset instructions sent to your email' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const reset_password = async (req, res) => {
    const { forget_password_code, newPassword } = req.body;
  
    try {
      // Find user by forget_password_code
      const user = await User.findOne({
        forget_password_code,
        passwordResetExpires: { $gt: Date.now() },
      });
  
      // Check if user exists with valid code
      if (!user) {
        return res.status(400).json({ message: 'Invalid verification code or expired request' });
      }
  
      user.password = await bcrypt.hash(newPassword, 12);
      user.forget_password_code = null;
      user.passwordResetExpires = null;
  
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

// Exporting functions to be used in other modules
module.exports = {LogIn,SignUp};
