// Importing the User model from "../Models/UserModel"
const User = require("../Models/UserModel");
const nodemailer = require('nodemailer');


// Declaring an asynchronous function to create users
const SignUp = async(req,res) => {
    try {
        const { First_name, name, email, selectedRole, num_tel, address, password, conf_password } = req.body;

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
            password,
            conf_password
        });

        await newUser.save(); // Sauvegarder le nouvel utilisateur

        return res.json({ success: true, message: "Inscription réussie" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Une erreur est survenue lors de l'inscription" });
    }
};

const LogIn = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Recherchez l'utilisateur dans la base de données
      const user = await User.findOne({ email });
  
      // Vérifiez si l'utilisateur existe
      if (!user) {
        return res.json({ message: "Utilisateur non trouvé" });
      }
  
      // Vérifiez si le mot de passe est correct
      if (user.password !== password) {
        return res.json({ message: "Mot de passe incorrect" });
      }

      if (!user.isEnabled) {
        return res.json({message:'Compte désactivé. Veuillez contacter l\'administrateur.'});
      }
      // Si l'utilisateur est trouvé et que le mot de passe est correct, retournez un succès
      res.json({ message: "Connexion réussie", user });
    } catch (error) {
      console.error("Erreur de connexion:", error);
      res.status(500).json({ message: "Une erreur est survenue lors de la connexion" });
    }
  };

// Configuration du service d'envoi d'e-mails avec Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'meriembenamara001@gmail.com', // Adresse e-mail à partir de laquelle envoyer les e-mails
      pass: '2512baba' // Mot de passe de l'adresse e-mail
    }
  });
  
  const ResetPassword = async (req, res) => {
    const { email } = req.body; // Extraction de l'adresse e-mail à partir du corps de la requête
  
    try {
      // Recherche de l'utilisateur avec l'e-mail fourni
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send('User not found'); // Si l'utilisateur n'est pas trouvé, renvoyer une réponse avec un statut 404
      }
  
      // Génération du token de réinitialisation
      const resetToken = Math.random().toString(36).substring(7);
      user.resetToken = resetToken; // Stockage du token dans l'objet utilisateur
      user.resetTokenExpiration = Date.now() + 3600000; // Expiration du token dans 1 heure
      await user.save(); // Sauvegarde des modifications de l'utilisateur dans la base de données
  
      // Envoi de l'e-mail de réinitialisation du mot de passe
      await transporter.sendMail({
        from: 'meriembenamara001@gmail.com', // Adresse e-mail de l'expéditeur
        to: email, // Adresse e-mail du destinataire
        subject: 'Reset Password', // Sujet de l'e-mail
        text: `Click this link to reset your password: http://localhost:8080/reset-password/${resetToken}` // Corps de l'e-mail
      });
  
      res.send('Reset password email sent'); // Envoi d'une réponse réussie
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error'); // En cas d'erreur interne du serveur, renvoyer une réponse avec un statut 500
    }
  };

const UpdatePassword = async (req, res) => {
    const { token, newPassword } = req.body; // Extraction du token et du nouveau mot de passe à partir du corps de la requête
  
    try {
      // Recherche de l'utilisateur avec le token valide
      const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
      if (!user) {
        return res.status(404).send('Invalid or expired token'); // Si l'utilisateur n'est pas trouvé ou si le token est expiré, renvoyer une réponse avec un statut 404
      }
  
      // Stockage du nouveau mot de passe dans l'objet utilisateur
      user.password = newPassword;
      user.resetToken = null; // Suppression du token de réinitialisation
      user.resetTokenExpiration = null; // Suppression de la date d'expiration du token
      await user.save(); // Sauvegarde des modifications de l'utilisateur dans la base de données
  
      res.send('Password updated successfully'); // Envoi d'une réponse réussie
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error'); // En cas d'erreur interne du serveur, renvoyer une réponse avec un statut 500
    }
  };

// Declaring an asynchronous function to get all users
const getAllUsers = async (req,res) => {
    try{
        // Finding all users in the database
        const users = await User.find()
        // Returning users as JSON response
        return res.status(200).json(users);
    } catch(error){
        // Handling errors and returning as JSON response
        return res.status(500).json({ success :false , message: error.message})
    }
};

// Declaring an asynchronous function to get a user by ID
const getUserById =async(req,res) => {
    // Getting the user ID from request parameters
    const id =req.params.userId;
    try{
        // Finding a user by ID
        const user = await User.findById(id);
        // Returning the user as JSON response
        return res.json(user);
    }catch (err) {
        // Handling errors and returning as JSON response
        return res.json(err);
    }
};

// Declaring an asynchronous function to delete a user
const deleteUser = async(req,res) => {
    // Getting the user ID from request parameters
    const id = req.params.userId ;
    try{
        // Deleting the user by ID
        const  deleteUser = await User.findByIdAndDelete(id);
        // Returning the deleted user as JSON response
        console.log('Utilisateur à supprimer :', user); // Vérifier l'objet utilisateur et l'ID
      
        return  console.log('Utilisateur à supprimer :', user);
    }catch(err){
        // Handling errors and returning as JSON response
        return res.json(err)
    }
};

const EnableUser = async (req, res) => {
  const id = req.params.userId;

  try {
    // Find user by ID
    const user = await User.findById(id);

    // Check if user exists
    if (!user) {
      return res.status(404).send('Utilisateur introuvable.');
    }

    // Check if user is already enabled
    if (user.isEnabled) {
      return res.status(400).send('L\'utilisateur est déjà activé.');
    }

    // Update user's isEnabled property to true
    user.isEnabled = true;
    await user.save();

    // Send success response
    res.status(200).send(`Utilisateur avec l'ID ${id} activé avec succès.`);
  } catch (error) {
    console.error(`Échec de l'activation de l'utilisateur avec l'ID ${id} :`, error);
    res.status(500).send("Erreur lors de l'activation de l'utilisateur.");
  }
};

const DisableUser = async (req, res) => {
  const id = req.params.userId;

  try {
    // Find user by ID
    const user = await User.findById(id);

    // Check if user exists
    if (!user) {
      return res.status(404).send('Utilisateur introuvable.');
    }

    // Check if user is already disabled
    if (!user.isEnabled) {
      return res.send("L'utilisateur est déjà désactivé.");
    }

    // Update user's isEnabled property to false
    user.isEnabled = false;
    await user.save();

    // Send success response
    res.status(200).send(`Utilisateur avec l'ID ${id} désactivé avec succès.`);
  } catch (error) {
    console.error(`Échec de la désactivation de l'utilisateur avec l'ID ${id} :`, error);
    res.status(500).send('Erreur lors de la désactivation de l\'utilisateur.');
  }
};

// Declaring an asynchronous function to update a user
const updateUser= async(req, res) => {
    // Getting the user ID from request parameters
    const id = req.params.userId;
    // Getting the updated data from request body
    const newData = req.body;
    try {
        // Updating the user by ID with new data
        const updateUser = await User.findByIdAndUpdate(id, newData, { new: true });
        // Returning the updated user as JSON response
        return res.json(updateUser);
    } catch (err) {
        // Handling errors and returning as JSON response
        return res.json(err);
    }
};

// Exporting functions to be used in other modules
module.exports = {LogIn,SignUp,ResetPassword,UpdatePassword,getAllUsers ,getUserById ,deleteUser, EnableUser, DisableUser,updateUser};
