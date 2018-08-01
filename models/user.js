'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    lastName: String,
    email: {type: String, unique: true},
    password: String,
    dateOfBirth: Date,
    phone: String,
    bio: String,
    socialNetworks: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
        github: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
