const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const io = require('socket.io')(http, {
  cors: {
    origin: 'https://stoic-wiles-9cc80d.netlify.app/',
    methods: ['GET', 'POST']
  }
})
const db = require('./db/db')
app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  console.log('Connected SockedId: ', socket.id)

  socket.on('queryGetUser', (user) => {
    db.getUser(user).then((resolve) => {
      socket.emit(
        'getUser',
        resolve ? {id: resolve._id, name: resolve.name} : resolve
      )
    })
  })

  socket.on('queryGetChatList', () => {
    setTimeout(() => {
      db.getChatList().then((resolve) => {
        io.emit('getChatList', resolve)
      })
    }, 500)
  })

  socket.on('queryDeleteChat', async (id, userId) => {
    await db.deleteChat(id, userId)
    db.getChatList().then((resolve) => {
      socket.emit('getChatList', resolve)
    })
  })

  socket.on('querySendMessagesInChat', (id, newMessage) => {
    db.sendMessagesInChat(id, newMessage)
  })

  // Создание нового чата
  socket.on('createChat', (newChat) => {
    db.addChat(newChat)
  })

  socket.on('queryGetUserById', (id) => {
    db.getUserById(id).then((resolve) => {
      socket.emit(
        'getUser',
        resolve ? {id: resolve._id, name: resolve.name} : resolve
      )
    })
  })

  // Регистрация пользователя
  socket.on('createUser', (user) => {
    db.createUser(user)
  })

  socket.on('disconnect', function () {
    console.log('A user disconnected')
  })
})

http.listen(process.env.PORT || 5000, () => console.log(`Server has started.`))
