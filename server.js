const express =require("express");   
const dotenv = require("dotenv").config();
const app = express();
const  UserRoutes =require('./Routes/UserRouter');
const  FeedbackRoutes =require('./Routes/FeedbackRouter');
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:8080",  // Autorise uniquement les requêtes depuis ce domaine
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Autorise les cookies
}));

mongoose.Promise = global.Promise;

// DATABASE CONNECTION
mongoose.connect("mongodb+srv://meriem:meriem@estimapro-database.dguo8or.mongodb.net/")
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log('Error connecting to database', err);
  });
  app.use(express.json());



 app.use('/api/users',UserRoutes);
 app.use('/api/feedback',FeedbackRoutes);
 


// SERVER LISTENING
 const port = process.env.PORT || 5000;

 app.listen(port ,() => {
    console.log(`server running on port ${port}`);
 }); 

 