import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        unique: true,
    },
    isAdmin:{
        type: Boolean,
        required: true,
        default: false,
    }
},{
    timestamps: true
})

//matchPassword(): it is user defined function, checks whether password entered is matching or not
userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
} 

//since password we receive from frontend is plain text, we need to encrypt password 
//this is done by using bcrypt hash
//pre is used to do something before it is saved in db, 'pre' will convert plain password
//into hash, beofre it is saved in db.

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        next()
    }

    //below code is used to convert plain password into hash
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User",userSchema)

export default User;