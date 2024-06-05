// Importing the User model from "../Models/UserModel"
const User = require("../Models/UserModel");
const Admin = require("../Models/AdminModel");
const jwt = require("jsonwebtoken");
//const nodemailer = require('nodemailer');


const bcrypt = require('bcrypt');

// Declaring an asynchronous function to create users
const SignUp = async(req,res) => {
    try {
        const { First_name, name, email, selectedRole, num_tel, address, password, conf_password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        if (password !== conf_password) {
            return res.json({ success: false, message: "Les mots de passe ne correspondent pas" });
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

    // Enregistrement du nouvel utilisateur
    await newUser.save();

    // Génération du jeton JWT
    //const token = jwt.sign({ userId: newUser._id }, secretKey); // Remplacez '1h' par la durée d'expiration souhaitée

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
        'YOUR_SECRET_KEY',
        { expiresIn: '1h' }
      );

      // Renvoi de la réponse avec le jeton JWT
      return res.json({ success: true, message: "Connexion réussie", user, token });

  } catch (error) {
      console.error("Erreur de connexion:", error);
      return res.status(500).json({ message: "Une erreur est survenue lors de la connexion" });
  }
};

// Exporting functions to be used in other modules
module.exports = {LogIn,SignUp};
