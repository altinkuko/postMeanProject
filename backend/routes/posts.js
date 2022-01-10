const express = require('express');
const Post = require("../models/post");
const router = express.Router();
const multer = require('multer');
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

router.post("", multer({storage: storage}).single("image") ,((req, res, next) => {
  const url = req.protocol+ '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url+"/images/" + req.file.filename
  });
  post.save().then(r => {
    res.status(200).json(r);
    console.log(r)});
}));

router.get("",
  (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let result;
  if (pageSize && currentPage){
    postQuery.skip(pageSize*(currentPage -1))
      .limit(pageSize);
  }
  postQuery
      .then(data => {
        result=data;
        return Post.count();
      }).then(count=>{
    res.status(200).json({posts: result, maxCount : count});
  });
  });

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id:req.params.id}).then(result=>{
    console.log(result);
    res.status(200).json(req.params.id);
  });
});

router.put('/:id',
  multer({storage: storage}).single("image"),(req, res, next) => {
    const post = req.body;
    let imagePath = req.body.imagePath;
    if (req.file){
    const url = req.protocol+ '://' + req.get("host");
    imagePath= url+"/images/" + req.file.filename;
  }
    post.imagePath = imagePath;
  Post.updateOne({_id:req.params.id}, post).then(result =>{
    res.status(200).json({result});
  })
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post=>{
    if (post){
      res.status(200).json(post);
    } else {
      res.status(404).json({message:'Post not found'});
    }
  });
})

module.exports = router;