const {Schema} = require('mongoose')

// Cхема чата
const chatSchema = new Schema({
  name: String,
  creator: String,
  lastMessage: String,
  users: [
    {
      id: String
    }
  ],
  messages: [
    {
      text: String,
      userId: String,
      userName: String,
      date: {type: Date, default: Date.now}
    }
  ]
})

// Схема пользователя
const userSchema = new Schema({
  name: String,
  password: String
})

module.exports.chatSchema = chatSchema
module.exports.userSchema = userSchema
