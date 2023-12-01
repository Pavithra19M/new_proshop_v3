import asyncHandler from "../middleware/asyncHandler.js";
import User from '../models/userModel.js';
import generateToken from "../utils/generateToken.js";

/////////////////////////////// User Login Route ///////////////////////////////////////////////

// @desc   Auth(login)user & get token
// @route  POST /api/users/auth
// @access Public
const loginUser = asyncHandler(async(req,res) => {
    //req.body: contians user details which is from database
    // destructing email and password
   const { email, password} = req.body;

   //checking particular user email present or not, if present we storing 'user' object 
   const user = await User.findOne({ email })

   //comparing if user and password exist, then it returns particular user details
   //matchPassword(): user defined function, a function call is made and send password to 
   //matchPassword() it is defined in userModel
   //once funcation call is made, from here it goes to userModel.js file
   if(user && (await user.matchPassword(password))){
    generateToken(res, user._id)

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    });
   } 
   // if user email or password did not match, throws error
   else{
    res.status(401)
    throw new Error('Invalid email or password')
   }
})

// @desc   Register user
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async(req,res)=> {
    //req.body: contians user details which is from database
    // destructing name,email and password
    const {name,email,password} = req.body

    //checking particular email exist or not, if exist storing 'userExists' variable
    const userExists = await User.findOne({email})

    //if same user already exits in db, we throw error
    if(userExists){
        res.status(400)
        throw new Error("User already exists")
    }

    // if it is new user, creating new user info, these info comes from frontend form
    const user = await User.create({
        name,
        email,
        password,
    })

    //if all details entered without any error in frontend, then assinging to its keys and 
    //stored in db
    if(user){
        generateToken(res,user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    } 
    //if any info entered in form is incorrect, then it throws error
        else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//  @desc   Logout user / clear cookie(used to clear in http web token)
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async(req,res) => {
   res.cookie('jwt', '' , {
    httpOnly:true,
    expires:new Date(0)
   })
   res.status(200).json({message: 'Logged out successfully'})
})

//  @desc   Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async(req,res)=>{

    //find particular user id and stored in 'user' variable
    const user = await User.findById(req.user._id);

    //if user exists, store all user info
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }
    // if not present, throws error
    else{
        res.status(404);
        throw new Error('User not found')
    }
})

//  @desc   Update user profile
// @route   PUT /api/users/profile, we are not updating by id, becoz user will not have access
//to update other details, user will have access oly to update their profile,it is done by
//web token
// @access  Private
const updateUserProfile = asyncHandler(async(req,res)=>{
   const user = await User.findById(req.user._id)

   if(user){
    //req.body.name => whch comes from form, it has updated name, email
    // in backend, it checks if name,email is udated or not, if it is updated, then saved in 
    //'user.name', 'user.email' variable and get updated in db, else existing name oly is saved in db. 
    user.name = req.body.name || user.name;
    user.email =  req.body.email || user.email

    //password is checked separetly bcoz, password is hased in db
   if(req.body.password){
    user.password = req.body.password;
   }

   //all updated user info is stored in 'updatedUser' variable
   const updatedUser = await user.save();

   res.status(201).json({
        _id:updatedUser._id,
        name:updatedUser.name,
        email:updatedUser.email,
        isAdmin:updatedUser.isAdmin
   });
   } else{
    res.status(404);
    throw new Error('User not found')
   }

   
})

//////////////////////////////// Admin Route ///////////////////////////////////////////////////

//  @desc   Get Users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async(req,res) => {
    const users = await User.find({})
    res.json(users)
    console.log("usersvvvf", users)
})

//  @desc   Get user by Id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async(req,res) => {
   const user = await User.findById(req.params.id).select('-password')
   console.log("user111", user)
   if(user){
    res.status(200).json(user)
   } else{
    res.status(404)
    throw new Error('User not found')
   }
})

//  @desc   Delete Users
// @route   DELETE /api/users/:id
//admin as access to delete or update details of all user, hence we use /:id
// @access  Private/Admin
const deleteUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id)

    if(user){
        if(user.isAdmin){
            res.status(400)
            throw new Error('Cannot delete admin user')
        }
        await User.deleteOne({_id: user._id})
        res.status(200).json({message : "User deleted successfully"})
    } else{
        res.status(404)
        throw new Error("User not found")
    }
})

//  @desc   Update Users
// @route   PUT /api/users/:id
//admin as access to delete or update details of all user, hence we use /:id
// @access  Private/Admin
const updateUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id)

    // req.body.name = it accepts updated name/email, if user/admin didn't
    // do any changes, then previous value wch is already present in user.name is oly saved
    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin)
        const updatedUser = await user.save()

        res.status.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAmdin: updatedUser.isAdmin
        })
    } else{
        res.status(404)
        throw new Error('User not found')
    }

    
})

export {
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser
};