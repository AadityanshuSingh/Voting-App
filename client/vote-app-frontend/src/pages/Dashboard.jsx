import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getSocket, sendMessage } from "../utils/socket";
import { data } from "react-router-dom";

const Dashboard = () => {
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState("");
  const [rooms, setRooms] = useState([]);
  const [currRoom, setCurrentRoom] = useState(null);
  const [OptA, setOptA] = useState("");
  const [OptB, setOptB] = useState("");

  useEffect(() => {
    const res = getSocket();
    setSocket(res);
    const payload = {
      type: "GET_ROOM",
    };
    sendMessage(payload);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("data received", data);
      if (data.type == "GET_ROOMS") {
        setRooms(data.data);
      } else if (data.type == "CAST_VOTE") {
        console.log("data received after updating vote", data);
        setRooms((prevRooms) =>
          prevRooms.map((room) => (room.id === data.id ? data : room))
        );

        setCurrentRoom((prev) => (prev && prev.id === data.id ? data : prev));
      }
    };
  }, [socket]);

  const handleCreateRoom = async () => {
    if (!question?.trim || !OptA?.trim || !OptB?.trim) return;

    const payload = {
      type: "CREATE_ROOM",
      id: rooms.length + 1,
      question: question,
      optA: OptA,
      optB: OptB,
    };

    await sendMessage(payload);
    const updRoom = {
      type: "GET_ROOM",
    };
    await sendMessage(updRoom);
  };

  const voteA = async () => {
    const payload = {
      type: "CAST_VOTE",
      id: currRoom.id,
      name: localStorage.getItem("username"),
      vote: "A",
    };
    console.log("data sent for voting", payload);
    await sendMessage(payload);
  };

  const voteB = async () => {
    const payload = {
      type: "CAST_VOTE",
      id: currRoom.id,
      name: localStorage.getItem("username"),
      vote: "B",
    };
    await sendMessage(payload);
  };

  const renderRooms = rooms.map((room) => {
    return (
      <MenuItem
        key={room.id}
        onClick={() => {
          setCurrentRoom(room);
          console.log(room);
        }}
      >
        Room ID : {room.id}
      </MenuItem>
    );
  });

  return (
    <>
      <Box
        width={"100%"}
        height={"100vh"}
        bg={"papayawhip"}
        borderRadius={"0"}
        overflow={"auto"}
        pt={"20px"}
        pb={"20px"}
        css={{
          "&::-webkit-scrollbar": {
            width: "10px",
          },
        }}
        alignContent={"center"}
      >
        <HStack>
          <Card ml={"auto"} w={"45%"}>
            <CardHeader>All Rooms</CardHeader>
            <CardBody>
              <Menu>
                <MenuButton as={Button}>Rooms Menu</MenuButton>
                <MenuList>{renderRooms}</MenuList>
              </Menu>
            </CardBody>
          </Card>
          <Card mr={"auto"} w={"45%"}>
            <CardHeader>Create Your Room</CardHeader>
            <CardBody>
              <Input
                placeholder="Post your question"
                mb={"4px"}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
              />
              <Input
                placeholder="Set Option A"
                mb={"4px"}
                onChange={(e) => {
                  setOptA(e.target.value);
                }}
              />
              <Input
                placeholder="Set Option B"
                mb={"4px"}
                onChange={(e) => {
                  setOptB(e.target.value);
                }}
              />
            </CardBody>
            <CardFooter>
              <Button bg={"blue.300"} onClick={handleCreateRoom}>
                Create
              </Button>
            </CardFooter>
          </Card>
        </HStack>
        <Card w={"60%"} mt={5} ml={"auto"} mr={"auto"}>
          <CardHeader>
            Current Room : {currRoom ? currRoom.id : "No Room Selected"}
          </CardHeader>
          <CardBody>
            {currRoom ? (
              <>
                <Text>Question : {currRoom.question}</Text>
                <HStack>
                  <Text>Option A : {currRoom.optA}</Text>
                  <Text>Votes for A : {currRoom.countA}</Text>
                </HStack>
                <HStack>
                  <Text>Option B : {currRoom.optB}</Text>
                  <Text>Votes for B : {currRoom.countB}</Text>
                </HStack>

                {localStorage.getItem("userRooms") ? (
                  localStorage.getItem("userRooms").includes(currRoom.id) ? (
                    <Text>You have already Voted</Text>
                  ) : (
                    <HStack>
                      <Button onClick={voteA}>Vote A</Button>
                      <Button onClick={voteB}>Vote B</Button>
                    </HStack>
                  )
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </CardBody>
        </Card>
      </Box>
    </>
  );
};

export default Dashboard;
