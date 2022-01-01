const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });


app.get('/', (req, res) => {
    res.sendFile(__dirname + '\\index.html');
});

app.get('/info', (req, res) => {
    res.sendFile(__dirname + '\\info.html');
});

var s = 0;
var m = 0;
var h = 0;
var go = 0;

var dev = ['OFF', [0, 0, 0], [], []];

setInterval(() => {
    if (go == 1){
        s += 1;
        if (s == 60){
            m += 1;
            s = 0;
        }
        else{

        }
        if (m == 60){
            m = 0;
            h += 1;
        }
        else {

        }
        if (h == 24){
            h = 0;
        }
        else {

        }
    }
    dev[1][0] = h;
    dev[1][1] = m;
    dev[1][2] = s;
}, 1000);

server.listen(process.env.PORT || 5000);

io.on("connection", (socket) => {
    console.log("User connected... user id = " + socket.id);
    // socket.broadcast.emit('reload', 'http://192.168.1.4:5000/');
    socket.emit('get', dev);
    

    socket.on("log", (data) => {
        
    });

    socket.on("change", (data) => {
        var nd = dev[0];
        // dev[0] = "off";
        console.log(dev);
        if (nd == 'ON'){
            dev[0] = 'OFF';
            dev[2].push('<div class="off">OFF BY <span>' + data + '</span> AT <span>' + String(h) + ' ' + String(m) + ' ' + String(s) + '</span></div>');
            s = 0;
            m = 0;
            h = 0;
            go = 0;
        }
        if (nd == 'OFF'){
            dev[0] = 'ON';
            dev[2].push('<div class="on">OFF BY <span>' + data + '</span> AT <span>' + String(h) + ' ' + String(m) + ' ' + String(s) + '</span></div>');
            s = 0;
            m = 0;
            h = 0;
            go = 1;
        }
        socket.emit('get', dev);        
    });

    socket.on('dev', (data) => {
        socket.emit('get', dev);
    });

    socket.on('GI', (data) => {
        socket.emit('GI', dev[2]);
    });

    setInterval(() => {
        socket.emit('hms', [h, m, s]);
    }, 1000);
    
    socket.on('disconnect', () =>{
        console.log("User disconnected... user id = " + socket.id);
    });
    
});
