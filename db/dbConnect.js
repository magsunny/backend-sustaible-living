const mongoose = require('mongoose');
require('dotenv').config()

async function dbConnect() {
    mongoose
        .connect(
            process.env.DB_URL,
            {
                useNewUrlParser:  true,
                useUnifiedTopology: true,
            }
        )
    .then(() => {
        console.log('Erfolgreiche Verbingung zu MongoDB Atlas');
    })
    .catch((error) => {
        console.log('Verbingung zu MongDB Atlas konnte nicht hergestellt werden!');
        console.log(error);
    })
}

module.exports = dbConnect; 