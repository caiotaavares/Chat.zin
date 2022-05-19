const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use('/', (req, res) => {
    res.render('index.html');
})

// Armazenar as mensagem em um array
var arrMessages = [];

// Forma de conexão do usuário com o servidor de websocket
io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);

    socket.emit('previousMessages', arrMessages);

    socket.on('sendMessage', data => {
        arrMessages.push(data);

        // Envia a mensagem pra todos os
        // usuário conectados na aplicação
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(3000);