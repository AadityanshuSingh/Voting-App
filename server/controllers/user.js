const { vote } = require("./room");

const Users = new Map();

exports.login = (req) => {
  if (!Users.get(req)) {
    let voted_rooms = [];
    Users.set(req, voted_rooms);
  }
  return {
    success: true,
    message: "User Logged in Successfully!!",
  };
};

exports.cast_vote = (req) => {
  let username = req.name;
  let room_id = req.id;
  let voted_rooms = Users.get(username);
  if (!voted_rooms.includes(room_id)) {
    let room_data = vote(req).data;
    voted_rooms.push(room_id);
    Users.set(username, voted_rooms);
    return {
      success: true,
      message: "Your vote has been recorded",
      data: room_data,
    };
  } else {
    return {
      success: false,
      message: "You have already voted",
    };
  }
};
