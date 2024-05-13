const Application = require('../models/application');

const sendApplication = async(res, res) => { 
    try{
        let application = await Application.create(req.body);
        await application.save();
        res.status(200).json('Application submitted')
    } catch(err) { 
        res.status(500).json(err)
    }
}

const show = async ()

module.exports = { sendApplication };