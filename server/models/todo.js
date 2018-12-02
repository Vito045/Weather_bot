var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1
    },
    completed: {
        type: Boolean
    },
    completerAt: {
        type: Number
    }
});

module.exports = {Todo}