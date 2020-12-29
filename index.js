const app = require('express')()
const http = require('http').createServer(app)
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

io.on('connection', (socket) => {
  console.log('Connected SockedId: ', socket.id)

  // Получение списка чатов и передача на Frontend
  socket.on('queryGetUser', (user) => {
    console.log('queryGetUser')
    db.getUser(user).then((resolve) => {
      socket.emit(
        'getUser',
        resolve ? {id: resolve._id, name: resolve.name} : resolve
      )
    })
  })

  // Получение списка чатов и передача на Frontend
  socket.on('queryGetChatList', () => {
    console.log('queryGetChatList')

    db.getChatList().then((resolve) => {
      io.emit('getChatList', resolve)
    })
  })

  // Получение сообщений чата по id и передача на Frontend
  socket.on('queryGetMessagesInChat', (id) => {
    console.log('queryGetMessagesInChat')

    db.getMessagesInChat(id).then((resolve) => {
      io.emit('getMessagesInChat', resolve)
    })
  })

  socket.on('queryDeleteChat', async (id, userId) => {
    console.log('queryDeleteChat')

    await db.deleteChat(id, userId)
  })

  // Получение сообщений чата по id и передача на Frontend
  socket.on('querySendMessagesInChat', (id, newMessage) => {
    console.log('querySendMessagesInChat')

    db.sendMessagesInChat(id, newMessage).then((resolve) => {
      io.emit('getMessagesInChat', resolve)
    })
  })

  // Создание нового чата
  socket.on('createChat', (newChat) => {
    console.log('createChat')

    db.addChat(newChat)
  })

  // Проверка пользователя на наличие в базе данных
  socket.on('checkUser', (name) => {
    console.log('checkUser')

    db.checkUser(name)
  })

  // Получение id и name пользователя и передача на Frontend
  socket.on('queryGetUserById', (id) => {
    console.log('queryGetUserById')

    db.getUserById(id).then((resolve) => {
      socket.emit(
        'getUser',
        resolve ? {id: resolve._id, name: resolve.name} : resolve
      )
    })
  })

  // Регистрация пользователя
  socket.on('createUser', (user) => {
    console.log('createUser')

    db.createUser(user)
  })

  socket.on('disconnect', function () {
    console.log('A user disconnected')
  })
})

http.listen(5000, () => {
  console.log('listening on http://localhost:5000')
})
