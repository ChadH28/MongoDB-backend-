const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const Info = require('../models/Info');
const auth_middleware = require('../middleware/jwt')

// @route GET api/info #R
// @desc get users info
// @access Private
router.get('/', auth_middleware, async (req, res) => {
    // res.send('Getting info')
    try {
        const info = await Info.find({user: req.user.id}).sort({date: -1})
        res.json(info);
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
    
})


// @route POST api/info #C
// @desc ADD user info
// @access Private
router.post('/', 
    [ 
        auth_middleware,
        [
            // ("What value you checking", "The error msg output")
            check("name","Name is required")
            .not()
            .isEmpty()
        ]
    ], async (req, res) => {
    // res.send('Add user info')
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {
        name,
        phone,
        id_number,
        blood_type,
        gender
    } = req.body;

    try {
        const newInfo = new Info({
            name,
            phone,
            id_number,
            blood_type,
            gender,
            user: req.user.id
        });

        const info = await newInfo.save();
        res.json(info)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }

})


// @route PUT api/info/:id #U
// @desc Edit user info
// @access Private
router.put('/:id', auth_middleware, async (req, res) => {
    // res.send('Editing and updating user info')
    const {
        name,
        phone,
        id_number,
        blood_type,
        gender
    } = req.body;

    // build info object
    const infoFields = {};
    if (name) infoFields.name = name;
    if (id_number) infoFields.id_number = id_number;
    if (phone) infoFields.phone = phone;
    if (blood_type) infoFields.blood_type = blood_type;
    if (gender) infoFields.gender = gender;

    try {
        let info = await Info.findById(req.params.id);
        console.log(req.params.id)

        if(!info) return res.status(404).json({
            msg: 'Info not found'
        })

        // make sure user owns info
        if(info.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: "Not Authorized" 
            })
        }

        info = await Info.findByIdAndUpdate(
            req.params.id,
            {$set: infoFields},
            {new: true}
        )

        res.json(info)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})


// @route DELETE api/info/:id #D
// @desc DELETE user info
// @access Private
router.delete('/:id', auth_middleware, async (req, res) => {
    // res.send('Deleting user info')
    try {
        let info = await Info.findById(req.params.id);

        if(!info) return res.status(404).json({
            msg: 'Info not found'
        })

        await Info.findByIdAndRemove(req.params.id)

        res.json({
            msg: "Contact Removed"
        })



        // make sure user owns info
        if(info.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: "Not Authorized" 
            })
        }



        res.json(info)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
})


module.exports = router;