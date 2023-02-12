const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Bitte einen Benutzernamen angeben'],
        unique: [true, 'Benutzername existiert bereits'],
    },
    
    email: {
        type: String,
        required: [true, 'Bitte eine E-Mail Adresse angeben'],
        unique: [true, 'E-Mail existiert'],
    },

    password: {
        type: String,
        required: [true, 'Bitte ein Passwort eingeben'],
        unique: false,
    },
});

module.exports = mongoose.model.Users || mongoose.model('Users', UserSchema);