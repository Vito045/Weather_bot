var mongoose = require('mongoose');

var Text = mongoose.model('Text', {
    text: {
        type: String,
        required: true,
        minlength: 1
    },
    userID: {
        type: String,
        required: true
    }
});

module.exports = {Text}