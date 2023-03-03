import Post from "../models/Post.js";

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user comments.author').exec()
        return res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        return res.status(500).json('can not get posts')
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const postId = req.params.id
        const posts = await Post.find({user: postId}).populate('user comments.author').exec()
        return res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        return res.status(500).json('can not get posts')
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id
        Post.findOneAndUpdate({
            _id: postId
        }, {
            $inc: {views: 1}
        }, {
            returnDocument: 'after'
        }, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json('Can not get the post')
            }
            if (!doc) {
                console.log(err)
                return res.status(404).json('Post not found')
            }
            return res.status(200).json(doc)
        }).populate('user comments.author')
    } catch (err) {
        return res.status(500).json('can not get the post')
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        Post.findOneAndDelete({
            _id: postId
        }, (err, doc) => {
            if (err) {
                return res.status(500).json('Can not get the post')
            }
            if (!doc) {
                return res.status(404).json('Post not found')
            }
            return res.status(200).json({status: 'success'})
        })
    } catch (err) {
        return res.status(500).json('can not get the post')
    }
}

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id
        await Post.updateOne({
            _id: postId
        }, {...req.body})
        return res.status(200).json({status: 'success'})
    } catch (err) {
        return res.status(500).json('can not update the post')
    }
}

export const createPost = async (req, res) => {
    try {
        const post = new Post({...req.body, user: req.userId})
        const result = await post.save()
        console.log(result)
        return res.status(200).json({...result._doc})
    } catch (err) {
        console.log(err)
        return res.status(500).json('post creation failed')
    }
}

export const toggleLike = async (req, res) => {
    try {
        const method = req.body.like ? '$addToSet' : '$pull'
        console.log(method)
        await Post.updateOne({
            _id: req.body.id
        }, {
            [method]: {likes: req.userId}
        })
        return res.status(200).json({status: 'success'})
    } catch (err) {
        console.log(err)
        return res.status(500).json('can not like the post')
    }
}

export const createComment = async (req, res) => {
    try {
        await Post.updateOne({
            _id: req.body.id
        }, {
            $addToSet: {comments: {author: req.userId, text: req.body.text}}
        })
        return res.status(200).json({status: 'success'})
    } catch (err) {
        console.log(err)
        return res.status(500).json('can not update the post')
    }
}