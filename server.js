const express =require("express");   
const dotenv = require("dotenv").config();
const app = express();

const FeedbackRoutes = require('./Routes/FeedbackRouter');
const StaticRoutes = require('./Routes/StaticRouter');
const PlanRoutes = require('./Routes/PlanRouter');
const AdminRoutes = require('./Routes/AdminRouter');
const UserRoutes = require('./Routes/UserRouter');

//const MessagesRoutes =require('./Routes/MessagesRouter');
const mongoose = require("mongoose");
const cors = require("cors");
const socketIO = require('socket.io');
const http = require("http");
//Nnnnnnn


const { auth, admin } = require('./Middlewares/auth');

app.get('/api/admin', auth, admin, (req, res) => {
    res.json({ message: 'Admin content' });
});

app.get('/api/user', auth, (req, res) => {
    res.json({ message: 'User content' });
});


//const authenticateToken = require('./Middlewares/auth');

//app.get('/protege', authenticateToken, (req, res) => {
  //  res.json(req.user);
//});


app.use(cors({
  origin: "http://localhost:8080",  // Autorise uniquement les requêtes depuis ce domaine
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Autorise les cookies
}));

mongoose.Promise = global.Promise;

// DATABASE CONNECTION
//mongoose.connect("mongodb+srv://meriem:meriem@estimapro-database.dguo8or.mongodb.net/")
mongoose.connect("mongodb+srv://meriem:meriem@estimapro-database.dguo8or.mongodb.net/")
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log('Error connecting to database', err);
  });
  app.use(express.json());

  const server = http.createServer(app);
const io = socketIO(server, { cors: true });
let connectedUsers = new Map();

io.on("connection", (socket) => {
    let { id } = socket.client;

    socket.on("connectUser", ({ name }) => {
        //  When the client sends 'name', we store the 'name',
        //  'socket.client.id', and 'socket.id in a Map structure
        connectedUsers.set(name, [socket.client.id, socket.id]);
        io.emit("onlineUsers", Array.from(connectedUsers.keys()));
    });

    socket.on("disconnect", () => {
        for (let key of connectedUsers.keys()) {
            if (connectedUsers.get(key)[0] === id) {
                connectedUsers.delete(key);
                break;
            }
        }
        io.emit("onlineUsers", Array.from(connectedUsers.keys()));
    });

    socket.on("startMessage", ({ senderId, receiverEmail }) => {
        startMessage(senderId, receiverEmail);
    });

    socket.on("sendMessage", ({ sender, receiver, message }) => {
        const { email, name } = receiver;
        let receiverSocketId =
            connectedUsers.get(name) === undefined ?
            false :
            connectedUsers.get(name)[1];
        let senderSocketId = connectedUsers.get(sender.name)[1];
        createMessage(sender._id, email, message).then(
            ({ info, isNewRecipient }) => {
                if (isNewRecipient && receiverSocketId) {
                    io.to(receiverSocketId).emit("newRecipient", info.sender);
                } else if (receiverSocketId) {
                    io.to(receiverSocketId).emit("message", info);
                }
                io.to(senderSocketId).emit("message", info);
            }
        );
    });
});




 app.use('/api/users',UserRoutes);
 app.use('/api/feedback',FeedbackRoutes);
 app.use('/api/Static',StaticRoutes);
 app.use('/api/Plan',PlanRoutes);
 app.use('/api/Admin',AdminRoutes);

 //app.use('api/messages',MessagesRoutes);





// SERVER LISTENING
 const port = process.env.PORT || 5000;

 app.listen(port ,() => {
    console.log(`server running on port ${port}`);
 }); 

 