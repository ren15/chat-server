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
      socket.emit('getMessagesInChat', resolve)
    })
  })

  socket.on('querySendMessagesInChat', (id, newMessage) => {
    db.sendMessagesInChat(id, newMessage).then((resolve) => {
      socket.emit('sendMessagesInChat', resolve)
    })
  })

  socket.on('createChat', (newChat) => {
    db.addChat(newChat)
  })

  socket.on('disconnect', function () {
    console.log('A user disconnected')
  })
})

http.listen(5000, () => {
  console.log('listening on http://localhost:5000')
})

const messages = [
  {
    id: 123,
    user: 'Иван',
    text: 'Как дела?',
    date: '12.04'
  },

  {
    id: 125,
    user: 'Петр',
    text: 'Нормально, сам?',
    date: '12.32'
  }
]

//db.getMessagesInRoom(room, messages)
