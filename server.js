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
    const io = new Server(server)
    io.on('connection', (socket)=>{
        console.log('a user connected' + socket.id)
        socket.on('disconnect', ()=>{
            console.log('user disconnected', socket.id)
        })
        socket.on('chat', (msg)=>{
            //console.log('message: ' + msg)
            io.emit('chat', msg)
        })
    })
    // io.on('disconnect', (socket)=>{
    //     console.log('user disconnected')
    // })

    server.listen(port, (err)=>{
        if(err) throw err;
        console.log(`> Ready on http://localhost:${port}`)
    })
})