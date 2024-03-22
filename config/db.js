const mongoose = require('mongoose');
require('dotenv').config()

function connect () { 
    try{ 
        mongoose.connect(process.env.DB_URI);
        console.log(`Database connected successfully`);
    }catch(error) { 
       throw new error;
    }
}
mongoose.connection.on('connection', () => { 
    console.log(`Database connected successfully`);
})
mongoose.connection.on('error', err => { 
    console.log(err);
})
module.exports = connect;