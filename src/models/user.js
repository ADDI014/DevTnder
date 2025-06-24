const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 50,
    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,  //uique index , if you specify 'unique : true' specifying 'index':true is optional if you do 'unique: true'
        lowercase : true,
        trim : true, 
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address" + value);
            }
        }
    },
    password : {
       type : String,
       required : true,
       validate(value) {
        if(!validator.isStrongPassword(value)) {
            throw new Error("Enter Strong passsword" + value);
        }
    }
    },
    age : {
        type : Number,
        min : 18,
    },
    gender: {
        type : String,
        enum : {
            values : ["male","female","others"],
            message : `{VALUE} is not a valid gender`
        }
        // validate(value) {
        //     if(!["male", "female" , "others"].includes(value)){
        //         throw new Error("Gender data is not valid");
        // }
    // }
    },
    photoUrl : {
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid URL address" + value);
            }
        }
    },
    skills : {
        type : [String]
    },
    about : {
        type : String,
    }
},{
    timestamps : true,
});


userSchema.methods.getJWT = async function () {

    const user = this;

    const token = jwt.sign({ _id : user._id} , "DEV@Tinder$790", {
        expiresIn : "7d",
    });

    return token;
}

userSchema.methods.validatePassword = async function(passwordEnterByUser){
    const user = this;

    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordEnterByUser , passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);

