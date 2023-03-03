import { body } from "express-validator";

export const loginValidation = [
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Too short password').isLength({ min: 6 }),
];

export const registerValidator = [
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Too short password').isLength({min: 6}),
    body('name', 'Too short name').isLength({min: 3}),
    body('surname', 'Too short surname').isLength({min: 3}),
    body('avatar', 'Incorrect URL').optional().isString()
]

export const postCreateValidation = [
    body('title', 'Enter a title').isLength({ min: 3 }).isString(),
    body('text', 'Enter a text').isLength({ min: 3 }).isString(),
    body('imageUrl', 'Incorrect link').optional().isString(),
];