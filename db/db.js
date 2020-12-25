const mongoose = require('mongoose')
const schemas = require('./schemas')
const config = require('./config')

const chatSchema = schemas.chatSchema
const userSchema = schemas.userSchema
// подключение

mongoose.connect(config.uri, {useNewUrlParser: true, useUnifiedTopology: true})

const Chat = mongoose.model('Chat', chatSchema)

const getChatList = async () => {
  try {
    return await Chat.find({}).exec()
  } catch (err) {
    err.stack
  }
}

const addChat = (param) => {
  const chat = new Chat(param)
  chat.save(function (err) {
    //mongoose.disconnect() // отключение от базы данных
    if (err) return console.log(err)
    console.log('Сохранен объект', chat)
  })
}

const getMessagesInChat = async (id) => {
  try {
    return await Chat.findById(id).exec()
  } catch (err) {
    err.stack
  }
}

const sendMessagesInChat = async (id, newMessage) => {
  try {
    return await Chat.findByIdAndUpdate(id, {
      $push: {messages: [newMessage]}
    }).exec()
  } catch (err) {
    err.stack
  }
}

module.exports.addChat = addChat
module.exports.getMessagesInChat = getMessagesInChat
module.exports.sendMessagesInChat = sendMessagesInChat
module.exports.getChatList = getChatList
