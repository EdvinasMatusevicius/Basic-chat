const socket = require('socket.io');
const onlineUserAvoidDuplicate = function (sessionName, socketId,io, arr, action) {
    if (arr.length > 0) {
        //iesko indexu online useriu array prisijungimo ir atsijungimo atvejais
        const searchUser = arr.findIndex((user) => {
            if (action === 'connection') {
                return user.nick === sessionName;
            } else if (action === 'disconnect') {
               const idSearch = user.socketId.find(function(id,index){
                    if(id===socketId){
                        user.socketId.splice(index,1);
                        return true
                    };
                });
               return idSearch !== undefined;
            }
        });
        if (searchUser === -1) {
            if (action === 'connection') {
                arr.push({ nick: sessionName, socketId: [socketId] });
            }
        } else {
            if (action === 'connection') {
                arr[searchUser].socketId.push(socketId);
            }else if(action === 'disconnect'){
                if(arr[searchUser].socketId.length===0){
                arr.splice(searchUser,1);
            }
            }
        }
    }else{
        if(action==='connection'){
            arr.push({ nick: sessionName, socketId: [socketId] });
        }
    }
    io.sockets.emit('updateOnline',arr);
}

const socketData = {
    socketOnline: [],
    socketInit: function (server, session) {
        const io = socket(server);
        io.use(function (socket, next) {
            session(socket.request, socket.request.res, next);
        });

        io.on('connection', function (socket) {
            console.log('io connected with id ' + socket.id)
            onlineUserAvoidDuplicate(socket.request.session.user.nick, socket.id,io,socketData.socketOnline, 'connection');

            socket.on('chat', function (data) {
                if (data.message.length <= 602) {
                    data.nick = socket.request.session.user.nick;
                    io.sockets.emit('chat', data);
                    console.log('sockete session user rodo', data);
                };
            });
            socket.on('typing', function (data) {
                data.nick = socket.request.session.user.nick;
                socket.broadcast.emit('typing', data)
            })
            socket.on('disconnect', function () {
                onlineUserAvoidDuplicate(socket.request.session.user.nick, socket.id,io,socketData.socketOnline, 'disconnect');
                io.sockets.emit('updateOnline',socketData.socketOnline);
            })
        })
    }
}
module.exports = socketData;