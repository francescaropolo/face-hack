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
});