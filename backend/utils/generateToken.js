import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    //creating JWT web token for authentication
const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: '30d'
});

// Set JWT as HTTP-Only Cookie
res.cookie('jwt',token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'develepoment',
    sameSite: 'strict',
    maxAge: 30*24*60*60*1000 //30 days
})
}

export default generateToken;