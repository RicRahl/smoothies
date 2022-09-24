const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minlength: [6, 'mlnimum password length is 6 charaters']
    },
})

// Hook: fire a function before doc saved to db (bcrypt)
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}


/*
// Hook: fire a function before doc saved to db
userSchema.pre('save', function (next) {
    console.log('user about to be created & saved', this)
    next();
})

// Hook: fire a funtion after doc saved to db
userSchema.post('save', function (doc, next) {
    console.log('new user was reated & saved', doc)
    next();
}) */

const User = mongoose.model('user', userSchema);

module.exports = User;