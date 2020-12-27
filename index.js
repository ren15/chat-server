const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})
const db = require('./db/db')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
const now = new Date()

io.on('connection', (socket) => {
  console.log('Connected SockedId: ', socket.id)
  // Получение списка чатов и передача на Frontend

  socket.on('queryGetChatList', () => {
    db.getChatList().then((resolve) => {
      socket.emit('getChatList', resolve)
    })
  })

  socket.on('queryGetMessagesInChat', (id) => {
    db.getMessagesInChat(id).then((resolve) => {
      io.emit('getMessagesInChat', resolve)
    })
  })

  socket.on('querySendMessagesInChat', (id, newMessage) => {
    db.sendMessagesInChat(id, newMessage).then((resolve) => {
      io.emit('sendMessagesInChat', resolve)
    })
  })

  socket.on('createChat', (newChat) => {
    db.addChat(newChat)
  })

  socket.on('checkUser', (name) => {
    db.checkUser(name)
  })

  socket.on('queryGetUser', (user) => {
    db.getUser(user).then((resolve) => {
      socket.emit(
        'getUser',
        resolve ? {id: resolve._id, name: resolve.name} : resolve
      )
    })
  })

  socket.on('createUser', (user) => {
    db.createUser(user)
  })

  socket.on('disconnect', function () {
    console.log('A user disconnected')
  })
})

http.listen(5000, () => {
  console.log('listening on http://localhost:5000')
})
