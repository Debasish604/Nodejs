const config = require('dotenv');
config.config({ path: '.env' })
const port = process.env.PORT || 5000
const app = require('./app');
const socketIO = require('socket.io');
const http = require('http');
const db = require('./database/database');
let server = http.createServer(app)
let io = socketIO(server)
let join_data
const JwtService = require('./service/jwtService');
const { MAX } = require('mssql');
const { resolve } = require('path');
const { rejects } = require('assert');
// process.on('unhandledRejection', err => {
//   console.log(`Error : ${err.message}`);
//   console.log(`sutting down the server due to Uncaught Exception`);
//   process.exit(1);
// })
//socket connection circute
io.on('connection', (socket, cb) => {
  //console.log("socket connected");
  //console.log("socket id is ", socket.client.conn.remoteAddress);

  socket.rem
  let roomMap = io.sockets.adapter.rooms
  //send socket isd to user
  socket.on('get_socket', (args, callback) => {
   // console.log('ioio okkk khokha..............................', socket.id)
    callback(socket.id)
  })
  //user want to connent another user
  socket.on('join-message', async (arg, callback) => {
    let args = JSON.parse(arg);
    //console.log("want to connect another user", socket.client.conn.remoteAddress,args.user.Name)
    join_data = arg
    let historyData = {"conFristName":args.user.Name.split(' ')[0],
    "conLastName":args.user.Name.split(' ')[1],
    "remoteFristtName":"",
    "remoteLastName":"",
    "connUserName":args.user.UserName,
    "RemoteUserName":"",
    "connIP":socket.client.conn.remoteAddress,
    "remoteIP":"",
    "sessionStart":new Date(),
    "sessionEnd":""}
    //console.log("user detils", historyData);
    let roomId = args.roomId
    const conHistoryId = await insertAndUpdateHistory(historyData);
    //console.log('Connection History ID:', conHistoryId);
    let user_details = JSON.stringify({ "user_details": args.user, "socket_id": socket.id, 'roomId': args.roomId ,"historyId":conHistoryId});
    await getSocketId(roomId,(callback) => {
      // console.log("room id is", roomId,callback)
      if (callback != 'offline') {
        // user access message 
        //console.log('callbackvalue is', callback)
        let authHeader=args.authorization
        //console.log('loginuser',authHeader);
        try{
          let data = JwtService.verify(authHeader)
          // console.log(data,callback)
       
        io.to(callback).emit('access-request', user_details, (callback) => {
          // console.log("access-request is working");
         })
      
        }
        catch(err){
          // console.log('hi',JSON.stringify(err))
          io.to(socket.id).emit('user-offline', 'You are a Unauthorized user.');
        }
     
      }
      else {
        // user is offline send to request user
        io.to(socket.id).emit('user-offline', 'user offline');
      }
    });
  })

  socket.on('reject', async (data) => {
    // console.log("click on the reject",data);
    let historyData = {
      "conFristName":"",
      "conLastName":"",
      "remoteFristtName":"",
      "remoteLastName":"",
      "connUserName":"",
      "RemoteUserName":"",
      "connIP":"",
      "remoteIP":"",
      "sessionStart":"",
      "sessionEnd":new Date(),
    }
    let jsondata = JSON.parse(data);
    
   const insertedId = await insertAndUpdateHistory(historyData,jsondata.historyId);
   //console.log("rw=ejectid",insertedId);
    io.to(jsondata.socket_id).emit('you-reject', data)
  })

  socket.on('RejectAfter', async (data) => {
    //console.log("click on the reject After screen share", data);
    let historyData = {
      "conFristName":"",
      "conLastName":"",
      "remoteFristtName":"",
      "remoteLastName":"",
      "connUserName":"",
      "RemoteUserName":"",
      "connIP":"",
      "remoteIP":"",
      "sessionStart":"",
      "sessionEnd":new Date(),
    }
    let jsondata = JSON.parse(data);
    // const insertedId = await insertAndUpdateHistory(historyData,jsondata.historyId);
    // console.log(insertedId)
    io.to(jsondata.socket_id).emit('you-reject-after', data)
  })

  //accept message to request user
  socket.on('accept', async (data) => {
    let jsondata = JSON.parse(data);
    console.log('accept data',jsondata)
    let historyData = {
      "conFristName":"",
      "conLastName":"",
      "remoteFristtName":jsondata.screendata.fristname,
      "remoteLastName":jsondata.screendata.lastname,
      "connUserName":"",
      "RemoteUserName":jsondata.screendata.username,
      "connIP":"",
      "remoteIP":socket.client.conn.remoteAddress,
      "sessionStart":"",
      "sessionEnd":"",
    }
    roomId = parseInt(jsondata.roomId)
    const insertedId = await insertAndUpdateHistory(historyData,jsondata.historyId);
    console.log(insertedId);
    socket.join(roomId)
    io.to(jsondata.socket_id).emit('join-you', data)
  })
  //request user join in a room
  socket.on('join', (data) => {
    let jsondata = JSON.parse(data);
    roomId = parseInt(jsondata.roomId)
    socket.join(roomId)
  })
  socket.on('shere-user-join', (roomId) => {
    if (!roomMap.has(socket.id)) {
      socket.join(roomId);
    }
  })
  //user is present or not in a database and he is online or not 
  getSocketId = async (uniqueId, callback) => {
    await db.poolconnect
    try {
      const request = db.pool.request();
      request.input('uniqueId', db.mssql.Int, uniqueId)
      request.output('response', db.mssql.VarChar(2000))
        .execute('[dbo].[get_socket_id]').then(function (recordsets, err, returnValue, affected) {
          // console.log("recordsets for get socket id", recordsets);
          callback(recordsets.output.response);
        })
    }
    catch {
      return
    }
  }

 

  //leavea the room and join another room
  const leaveOtherRooms = (socketID) => {
    if (roomMap.has(socketID)) {
      roomMap.forEach((value, key) => {
        if (value.size > 1) {
          // console.log("i m val", key, value)
          let setVal = value
          setVal.forEach((value, key) => {
            if (value == socketID) {
              setVal.delete(value)
            }
          })
        }
      })
    }
  }
  //leave the room when user disconnect
  socket.on('room-leave', (roomId) => {
    socket.leave(roomId);
  })
  //user disconnect
  socket.on("disconnect", async () => {
    //console.log("i m disconnecting.. after click on share screen reject")
    leaveOtherRooms(socket.id);
  })
  //screen share start
  socket.on("screen-data", (data) => {
    data = JSON.parse(data);
    var room = data.room;
    var imgStr = data.image;
    // let id = join_data.UniqueId
    socket.to(room).emit("scree-image", imgStr);
  })

  //mouse movement
  socket.on('mouse-move', (data) => {
    // console.log("mouse move data is",data);
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("move-mouse", data);
  })
  // mouse click event
  socket.on('mouse-click', (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("click-mouse", data);

  })
  //mouse scroll event
  socket.on("scroll", (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("scroll", data)

  })
  //mouse type event
  socket.on("type", (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("type", data);

  })
  //mouse double click
  socket.on("dobule-click", (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("dobule-click", data);
  })

  //mouse right click event
  socket.on("right-click", (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("right-click", data);
  })
  //mouse auxious click
  socket.on("auxclick", (data) => {
    var room = parseInt(JSON.parse(data).room);
    socket.to(room).emit("auxclick", data);
  })



});

async function insertAndUpdateHistory(userDetails, id = null) {
  // Prepare the connection data
  let connectionData = [{
      "CONN_FIRST_NAME": userDetails.conFristName,
      "CONN_LAST_NAME": userDetails.conLastName,
      "REMOTE_FIRST_NAME": userDetails.remoteFristtName,
      "REMOTE_LAST_NAME": userDetails.remoteLastName,
      "CONN_USER_NAME": userDetails.connUserName,
      "REMOTE_USER_NAME": userDetails.RemoteUserName,
      "CONN_IP": userDetails.connIP,
      "REMOTE_IP": userDetails.remoteIP,
      "SESSION_START": userDetails.sessionStart,
      "SESSION_END": userDetails.sessionEnd
  }];
  // console.log('hi id',id)

  // console.log('Connection Data:', connectionData);

  try {
      // Create a request object
      const request = db.pool.request();

      // Set input parameters
      request.input('JSON_DATA', db.mssql.NVarChar(MAX), JSON.stringify(connectionData));
      request.input('Id', db.mssql.BigInt, id);
      request.output('NewID',db.mssql.BigInt)

      // Execute the stored procedure and await the result
      const result = await request.execute('[dbo].[Connection_histroy_collect]');

      // Access output parameters if needed
      const newId = result.output.NewID;

      // Return the result
      return newId;
  } catch (e) {
      // Handle errors
      console.error('Error executing stored procedure:', e);
      throw e; // Re-throw the error to be handled by the caller
  }
}

// Example usage of the async function
// async function main() {
//   try {
//       const historyData = {
//           conFristName: 'John',
//           conLastName: 'Doe',
//           remoteFristtName: 'Jane',
//           remoteLastName: 'Smith',
//           connUserName: 'john_doe',
//           RemoteUserName: 'jane_smith',
//           connIP: '192.168.1.1',
//           remoteIP: '192.168.1.2',
//           sessionStart: new Date(),
//           sessionEnd: new Date()
//       };

//       // Call the async function and wait for the result
//       const conHistoryId = await insertAndUpdateHistory(historyData);
//       console.log('Connection History ID:', conHistoryId);
//   } catch (e) {
//       // Handle any errors from insertAndUpdateHistory
//       console.error('Error in main function:', e);
//   }
// }



//server
const server1 = server.listen(port, () => {
  console.log(`server is runing http://localhost:${port}`);
});
//unhandle promise Rejection
process.on('unhandledRejection', (err) => {
  server1.close(() => {
    process.exit(1);
  })
})





