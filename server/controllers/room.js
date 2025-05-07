const rooms = [];
exports.createRoom = (req) => {
  let newRoom = {
    id: req.id,
    question: req.question,
    optA: req.optA,
    optB: req.optB,
    countA: 0,
    countB: 0,
  };
  rooms.push(newRoom);
  console.log(`Room created successfully with RoomId: ${newRoom.id}`);
};

exports.joinRoom = (req) => {
  let idx = req.id;
  if (rooms.length < idx + 1) {
    return {
      success: false,
      message: "No Such Room found",
    };
  } else {
    return {
      success: true,
      message: "Room joined successfully",
      data: rooms[idx],
    };
  }
};

exports.getRooms = () => {
  return rooms;
};

exports.vote = (req) => {
  let idx = req.id;
  if (req.vote == "A") rooms[idx].countA += 1;
  else rooms[idx].countB += 1;
  return {
    success: true,
    message: "Vote casted successfully",
    data: rooms[idx],
  };
};
