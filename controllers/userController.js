import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getOneUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById({_id: userId}, {passwordHash: 0, __v: 0}).populate('followings followers')
        return res.status(200).json(user)
    } catch (err) {
        console.log(err)
    }
}

export const searchUser = async (req, res) => {
    try {
        const query = req.params.query.toLowerCase()
        const userPattern = new RegExp('^' + query, "i")
        const users = await User.find({$or: [{
            name: {$regex: userPattern}
        }, {
            surname: {$regex: userPattern}
        }]}, {passwordHash: 0, __v: 0}).populate('followings followers')
        return res.status(200).json(users)
    } catch (err) {
        console.log(err)
    }
}

export const getMe = async (req, res) => {
    try {

        const me = await User.findById(req.userId).populate('followings followers')
        const { passwordHash, __v, ...result} = me._doc
        return res.status(200).json(result)
    } catch (err) {
        console.log(err)
        return res.status(500).json('can not auth')
    }
}

export const register = async (req, res) => {
    try {

        const existingUser = await User.findOne({email: req.body.email})

        if (existingUser) {
            return res.status(400).json({error: 'You already have an account'})
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const user = new User({
            ...req.body,
            passwordHash: hash
        })
        const result = await user.save()
        const token = jwt.sign({
            _id: result._id
        }, 'key', {
            expiresIn: '60d'
        })

        const {passwordHash, __v, ...response} = result._doc

        return res.status(200).json({...response, token})
    } catch (err) {
        console.log(err)
        return res.status(500).json('registration error')
    }
}
export const login = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        }).populate('followings followers')

        if (!user) {
            return res.status(404).json({error: 'User not found'})
        }

        const isPasswordValid = bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isPasswordValid) {
            return res.status(404).json({error: 'Incorrect email or password'})
        }
        const token = jwt.sign({
            _id: user._id
        }, 'key', {
            expiresIn: '60d'
        })

        const {passwordHash, __v, ...response} = user._doc

        return res.status(200).json({...response, token})

    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Auth error'})
    }
}

export const toggleFollow = async (req, res) => {
    try {
        const method = req.body.follow ? '$addToSet' : '$pull'
        const userId = req.body.id
        await User.updateOne({
            _id: req.userId
        }, {
                [method]: {followings: userId}
            })
        await User.updateOne({
            _id: userId
        }, {
                [method]: {followers: req.userId}
            })
        return res.status(200).json({status: 'success'})
    } catch (err) {
        console.log(err)
        return res.status(500).json('can not update the post')
    }
}