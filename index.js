import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import * as fs from "fs";
import cors from "cors";


import {getMe, getOneUser, login, register, searchUser, toggleFollow} from "./controllers/userController.js";
import {loginValidation, postCreateValidation, registerValidator} from "./validations/validation.js";
import {
    createComment,
    createPost,
    deletePost,
    getAllPosts,
    getOne,
    getUserPosts,
    toggleLike,
    updatePost,
} from "./controllers/postController.js";
import {checkAuth} from "./utils/checkAuth.js";
import handleErrors from "./utils/handleValidationErrors.js";


mongoose.connect(process.env.MONGO_KEY).then(() => console.log('db ok')).catch((err) => console.log('error happened', err))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.get('/search/:query', searchUser)
app.get('/users/:id', getOneUser)
app.get('/auth/me', checkAuth, getMe)
app.post('/register', registerValidator, handleErrors, register)
app.post('/login', loginValidation, handleErrors, login)
app.put('/follow', checkAuth, toggleFollow)

app.post('/post', checkAuth, postCreateValidation, handleErrors, createPost)
app.post('/comment', checkAuth, createComment)
app.get('/posts', getAllPosts)
app.get('/posts/:id', getOne)
app.get('/user/posts/:id', getUserPosts)
app.delete('/posts/:id', checkAuth, deletePost)
app.put('/posts/:id', checkAuth, postCreateValidation, handleErrors, updatePost)
app.put('/like', checkAuth, toggleLike)

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
app.listen(process.env.PORT || 5000, (err) => {
    if (err) {
        console.log('something went wrong')
    }
})