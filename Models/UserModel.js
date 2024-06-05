const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
//role: 
//{ 
 // type: String,
 // default: 'user',
   //enum: ['admin', 'user'],
  //  required: true
 //},

createdAt: {
    type: Date,
    default: Date.now
},
First_name: {
    type: String,
    required: true,
  },
  
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    
  },
  selectedRole: {
    type: String,
    required: true,
    
  },

  num_tel: {
    type: String,
    required: true,
    unique: true,
  },

  address: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  conf_password: {
    type: String,
    required: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },

 
  Birthday: {
    type: String,
    default:' ',
  },
  anc_password: {
    type: String,
    default:' ',
  },
  new_password: {
    type: String,
    default:' ',
  },
  conf_new_password: {
    type: String,
    default:' ',
  },

  resetTokenExpiration: Date,

  profileUrl: {
    type: String,
  },
  
  chats:
   [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  
});


module.exports = mongoose.model('User', userSchema);
