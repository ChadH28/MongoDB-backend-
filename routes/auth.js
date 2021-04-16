const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const auth_middleware = require('../middleware/jwt')

// @route GET api/auth
// @desc get LOGGED  user
// @access Private
router.get('/', auth_middleware, async (req, res) => {
    // res.send('Getting a logged in user')
    
    try {
        let user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

// @route POST api/auth
// @desc Auth user and get token 
// @access Public
router.post('/', [
    check('email', 'Please include a valid email')
    .isEmail(),
    check('password', 'Please enter a password')
    .isLength({min:5})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {
        email,
        password
    } = req.body;

    try {
        let user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({
                msg: 'Invalid user'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                msg: 'Invalid password credentials'
            })
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 36000},
            (error, token) => {
                if(error) throw error;
                res.json({token})
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
        
    }
})

module.exports = router;