const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({

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
  resetTokenExpiration: Date,

  
});


module.exports = mongoose.model('User', userSchema);
