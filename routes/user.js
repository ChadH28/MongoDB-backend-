const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../models/User')

// @route POST api/users
// @desc REGISTER a user
// @access Public
router.post('/', [
    check('name', 'name is required')
    .not()
    .isEmpty(),
    check('email', 'Please include a valid email')
    .isEmail(),
    check('password', 'Please enter a password')
    .isLength({min:5})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    // res.send('Passed')
    // console.log('worked')

    const {
        name,
        email,
        password
    } = req.body;

    try {
        let user = await User.findOne({email});

        if (user) {
            return res.status(400).json({
                msg: 'user already exists'
            });
        }
        user = new User({
            name,
            email,
            password 
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password,salt)

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 36000},
            (error, token) => {
                if(error) throw error;
                res.json({token})
            }
        )

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

module.exports = router;