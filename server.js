const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = 3000;

const NextApp = next({dev})
const nextHandler = NextApp.getRequestHandler();

NextApp.prepare().then(()=>{
    const server = createServer((req, res)=>{
        nextHandler(req, res);
    })
    const roomMessages = {};
    const io = new Server(server)
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
    
        socket.on('join-room', (data) => {
            const { id } = data;
            socket.join(id);
            const existingMessages = roomMessages[id] || '';
            socket.emit('chat', existingMessages);
        });
        socket.on('chat', (data) => {
            const { id, msg } = data;
            roomMessages[id] = msg;
            io.to(id).emit('chat', msg);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    // io.on('disconnect', (socket)=>{
    //     console.log('user disconnected')
    // })

    server.listen(port, (err)=>{
        if(err) throw err;
        console.log(`> Ready on http://localhost:${port}`)
    })
})