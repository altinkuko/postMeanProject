const Post = require("../models/post");


exports.createPost = ((req, res, next) => {
  const url = req.protocol+ '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url+"/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(r => {
    res.status(200).json(r);
    console.log(r)});
})

exports.getAllPosts = (req, res, next) => {
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
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id:req.params.id, creator:req.userData.userId}).then(result=>{
    if (result.deletedCount >0){
      res.status(200).json({message: "Deleted Successfully"});
    } else {
      res.status(403).json({message: "Not Authorized"});
    }
  });
}

exports.updatePost = (req, res, next) => {
  const post = req.body;
  let imagePath = req.body.imagePath;
  if (req.file){
    const url = req.protocol+ '://' + req.get("host");
    imagePath= url+"/images/" + req.file.filename;
  }
  post.imagePath = imagePath;
  Post.updateOne({_id:req.params.id, creator:req.userData.userId}, post).then(result =>{
    if (result.matchedCount >0){
      res.status(200).json({message: "Updated Successfully"});
    } else {
      res.status(403).json({message: "Not Authorized"});
    }
  })
}

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id).then(post=>{
    if (post){
      res.status(200).json(post);
    } else {
      res.status(404).json({message:'Post not found'});
    }
  });
}
