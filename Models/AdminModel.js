const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
//role: 
//{ 
  //type: String,
 // default: 'admin',
   //enum: ['admin', 'user'],
   // required: true
 //},

createdAt: {
    type: Date,
    default: Date.now
},
First_name: {
    type: String,
    required: true,
    default: 'Admin',
  },
  
  name: {
    type: String,
    required: true,
    default: 'Admin',

  },

  email: {
    type: String,
    required: true,
    unique: true,
    default: 'Admin@gmail.com',
  },

  password: {
    type: String,
    required: true, 
    default: 'Admin@gmail.com'
},

  profileUrl: {
    type: String,
  },
  
  chats:
   [{ type: mongoose.Schema.Types.ObjectId, ref: "Admin" }],

  
});


module.exports = mongoose.model('Admin', adminSchema);
