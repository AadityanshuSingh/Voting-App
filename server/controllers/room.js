const rooms = [];
exports.createRoom = (req) => {
  let newRoom = {
    id: req.id,
    question: req.question,
    optA: req.optA,
    optB: req.optB,
    isTimeOut: req.isTimeOut,
    duration: req.duration,
    endTime: req.endTime,
    countA: 0,
    countB: 0,
  };
  console.log(newRoom);
  rooms.push(newRoom);
  console.log(`Room created successfully with RoomId: ${newRoom.id}`);
};

exports.joinRoom = (req) => {
  let idx = req.id;
  if (rooms.length < idx) {
    return {
      success: false,
      type: "JOINROOM",
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
  return {
    type: "GET_ROOMS",
    data: rooms,
  };
};

exports.vote = (req) => {
  let idx = req.id;
  if (req.vote == "A") rooms[idx - 1].countA += 1;
  else rooms[idx - 1].countB += 1;
  return rooms[idx - 1];
};
