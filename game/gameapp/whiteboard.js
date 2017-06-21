


var connect = function connect (io) {



    io.on('connection', function (socket) {



        socket.on('drawing', (data) => socket.broadcast.emit('drawing', data)
        )
        ;



})
};
exports.connect = connect;