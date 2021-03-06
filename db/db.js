const mongoose = require('mongoose')
const schemas = require('./schemas')
require('dotenv').config()

const chatSchema = schemas.chatSchema
const userSchema = schemas.userSchema

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ct7vt.mongodb.net/chat-db?retryWrites=true&w=majority`

// подключение
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const Chat = mongoose.model('Chat', chatSchema)
const User = mongoose.model('User', userSchema)

const getChatList = async () => {
  try {
    return await Chat.find({}).exec()
  } catch (err) {
    err.stack
  }
}

const addChat = async (param) => {
  const chat = new Chat(param)
  try {
    return await chat.save().exec()
  } catch (err) {
    err.stack
  }
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

const deleteChat = async (idChat, userId) => {
  try {
    return await Chat.findByIdAndDelete(idChat).exec()
  } catch (err) {
    err.stack
  }
}

const getUser = async ({name, password}) => {
  try {
    return await User.findOne({name, password}).exec()
  } catch (err) {
    err.stack
  }
}

const getUserById = async (id) => {
  try {
    return await User.findById(id).exec()
  } catch (err) {
    err.stack
  }
}

const createUser = async ({name, password}) => {
  const user = new User({name, password})
  try {
    return await user.save().exec()
  } catch (err) {
    err.stack
  }
}

module.exports.addChat = addChat
module.exports.getMessagesInChat = getMessagesInChat
module.exports.sendMessagesInChat = sendMessagesInChat
module.exports.getChatList = getChatList
module.exports.createUser = createUser
module.exports.getUser = getUser
module.exports.getUserById = getUserById
module.exports.deleteChat = deleteChat
