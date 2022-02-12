const mongoose = require('mongoose')
const { Schema } = mongoose.Schema;

var menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true }
})

var Menu = mongoose.model('Menu', menuSchema)
module.exports = Menu;