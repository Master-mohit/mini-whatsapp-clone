const io = require( "socket.io" )();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );

    socket.on("max", (chacha)=>{
        console.log(chacha)

        socket.broadcast.emit("sony", chacha)

});

})

module.exports = socketapi