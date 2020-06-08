var mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:{
      type:String,
      required:true,
      maxlength:32,
      trim:true
  },
  lastname:{
      type:String,
      maxlength:20,
      trim:true
  },
  email: {
      type: String,
      trim: true,
      required: true,
      unique: true
  },
  userinfo: {
      type: String,
      trim: true
  },
  encry_password: {
    type:String,
    required:true
  },

  //salt (cryptography)
  salt: String,
 
  role: {
      type: Number,
      default: 0
  },
  purchases: {
      type: Array,
      default: []
  }

},{timestamps:true});

userSchema.virtual("password")
    .set(function(password){
        this._password = password // if _ is used than our variable is private this is normal password
        this.salt = uuidv1()
        this.encry_password = this.securePassword(password)  //this is encrypted password created using securePassword function
    })
    .get(function(){
        return this._password
    })

userSchema.methods = {

    authenticate:function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password
    },

    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto.createHmac('sha256',this.salt)
            .update(plainpassword)
            .digest('hex');
        }catch(err){
            return "";
        }
    }
}

module.exports = mongoose.model("User" , userSchema)