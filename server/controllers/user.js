const { vote } = require("./room");

const Users = new Map();

exports.login = (req) => {
  console.log("Data recieved in server for login", req);
  if (!Users.get(req)) {
    let voted_rooms = [];
    Users.set(req, voted_rooms);
  }
  return {
    success: true,
    type: "LOGIN",
    message: "User Logged in Successfully!!",
    data: Users[req],
  };
};

exports.cast_vote = (req) => {
  let username = req.name;
  let room_id = req.id;
  let voted_rooms = Users.get(username);
  console.log("Data received for voting", req);
  if (!voted_rooms.includes(room_id)) {
    let room_data = vote(req);
    voted_rooms.push(room_id);
    Users.set(username, voted_rooms);
    console.log("room data after vote", room_data);
    return {
      success: true,
      type: "CAST_VOTE",
      message: "Your vote has been recorded",
      data: room_data,
      id: room_id,
    };
  } else {
    return {
      success: false,
      type: "CAST_VOTE",
      message: "You have already voted",
    };
  }
};
