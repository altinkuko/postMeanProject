const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require("../middleware/check-auth")
const postService = require("../services/postService")

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg':'jpg'
}
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid Image');
    if (isValid){
      error=null;
    }
    cb(error,"backend/images");
  },
  filename:(req,file,cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name+'_'+Date.now()+'.'+ext);
  }
})

router.post("", checkAuth, multer({storage: storage}).single("image") , postService.createPost);

router.get("",postService.getAllPosts);

router.delete('/:id', checkAuth, postService.deletePost);

router.put('/:id', checkAuth, multer({storage: storage}).single("image"), postService.updatePost);

router.get('/:id', postService.getPostById)

module.exports = router;
