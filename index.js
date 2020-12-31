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
    db.getUser(user).then((resolve) => {
      socket.emit(
        'getUser',
        resolve ? {id: resolve._id, name: resolve.name} : resolve
      )
    })
  })

  // Получение списка чатов и передача на Frontend
  socket.on('queryGetChatList', () => {
    db.getChatList().then((resolve) => {
      setTimeout(() => {
        console.log('queryGetChatList, getChatList')
        io.emit('getChatList', resolve)
      }, 1000)
    })
  })

  // Получение сообщений чата по id и передача на Frontend
  socket.on('queryGetMessagesInChat', (id) => {
    db.getMessagesInChat(id).then((resolve) => {
      setTimeout(() => {
        io.emit('getMessagesInChat', resolve)
      }, 1000)
    })
  })

  socket.on('queryDeleteChat', async (id, userId) => {
    await db.deleteChat(id, userId)
    db.getChatList().then((resolve) => {
      setTimeout(() => {
        console.log('queryDeleteChat, getChatList')

        io.emit('getChatList', resolve)
      }, 1000)
    })
  })

  // Получение сообщений чата по id и передача на Frontend
  socket.on('querySendMessagesInChat', (id, newMessage) => {
    db.sendMessagesInChat(id, newMessage).then((resolve) => {
      setTimeout(() => {
        io.emit('getMessagesInChat', resolve)
      }, 1000)
    })
  })

  // Создание нового чата
  socket.on('createChat', (newChat) => {
    db.addChat(newChat)
  })

  // Проверка пользователя на наличие в базе данных
  socket.on('checkUser', (name) => {
    db.checkUser(name)
  })

  // Получение id и name пользователя и передача на Frontend
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

http.listen(5000, () => {
  console.log('listening on http://localhost:5000')
})
