import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router()

//it used to storage images, we can store image in amzonBucket or server
//we are diskStorage which stores image in server
const storage = multer.diskStorage({
    //destination is use to indicate location of image stored
    //destination takes 3 arugments, req -> request, file, cb->callback
    destination(req,file,cb){
        //cb takes 2 arguments, null -> which show error, /uploads -> used to save images
        cb(null,'uploads/');

    },
    // how to format filename
    filename(req, file, cb){
        //filename-date-filetype-extname used(jpg/jpeg/png)
        cb(null,`${file.filename}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file, cb){
    // /jpg|jpeg|png/ = pattern search and checking file uploaded is same type or not
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //mimetype = mediatype, it wch mediatype file is, whether it is sound or image file
    const mimetype = filetypes.test(file.mimetype);
    if( extname && mimetype ){ 
        // if uploaded file from frontend is samefile type as mimetype
        //then it accepts the file uploaded
        return cb(null, true)
    } else{
        // else throws error, oly images can b uploaded
         cb('Images only')
    }
}

const upload = multer({
    storage,
});

//creating route using 'POST' method
// upload.single('image') = is a middleware,  oly 1 image can be uploaded
router.post('/', upload.single('image'),(req,res)=>{
    res.send({
        message: 'Image uploaded',
        image: `/${req.file.path}`,
    })
})

export default router;