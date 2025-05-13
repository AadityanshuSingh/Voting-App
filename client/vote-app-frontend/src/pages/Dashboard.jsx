import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getSocket, sendMessage } from "../utils/socket";
import { data } from "react-router-dom";
import Chart from "../components/Chart";
import Timer from "../components/Timer";

const Dashboard = () => {
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState("");
  const [rooms, setRooms] = useState([]);
  const [currRoom, setCurrentRoom] = useState(null);
  const [OptA, setOptA] = useState("");
  const [OptB, setOptB] = useState("");
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [duration, setDuration] = useState(1);
  const toast = useToast();

  const callToast = (title, status) => {
    toast({
      title: title,
      status: status,
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

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
        if (!data.success) {
          callToast(data.message, "error");
          return;
        }
        callToast(data.message, "success");
        setCurrentRoom((prev) =>
          prev && prev.id === data.id ? data.data : prev
        );
        setRooms((prevRooms) =>
          prevRooms.map((room) => (room.id === data.id ? data.data : room))
        );
      }
    };
  }, [socket]);

  const handleCreateRoom = async () => {
    if (question?.trim() == "" || OptA?.trim() == "" || OptB?.trim() == "") {
      callToast("Please fill all the fields", "error");
      return;
    }
    // console.log(question, OptA, OptB, isTimeOut, duration);
    const payload = {
      type: "CREATE_ROOM",
      id: rooms.length + 1,
      question: question,
      optA: OptA,
      optB: OptB,
      isTimeOut: isTimeOut,
      duration: duration,
      endTime: new Date(Date.now() + duration * 1000 * 60),
    };

    await sendMessage(payload);
    const updRoom = {
      type: "GET_ROOM",
    };
    await sendMessage(updRoom);
  };

  const isTimedOut = () => {
    const currTime = new Date();
    const endTime = new Date(currRoom.endTime);
    if (currTime >= endTime) {
      return true;
    }
    return false;
  };

  const voteA = async () => {
    if (currRoom.isTimeOut && isTimedOut()) {
      callToast("Poll has ended. You cannot vote!!", "warning");
      return;
    }
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
    if (currRoom.isTimeOut && isTimedOut()) {
      callToast("Poll has ended. You cannot vote!!", "warning");
      return;
    }
    const payload = {
      type: "CAST_VOTE",
      id: currRoom.id,
      name: localStorage.getItem("username"),
      vote: "B",
    };
    await sendMessage(payload);
  };

  const handleCheckbox = () => {
    setIsTimeOut((prev) => !prev);
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
        bgGradient={"linear(to-b, #90cbed, #c8e8f5, #e4eef7)"}
        borderRadius={"0"}
        overflow={"auto"}
        pt={"20px"}
        pb={"20px"}
        css={{
          "&::-webkit-scrollbar": {
            width: "10px",
          },
        }}
        textColor={"gray.200"}
      >
        <HStack h={"inherit"}>
          <Card
            bgGradient={"linear(to-br, #0f0f0f, #1a1a40, #23235b)"}
            ml={"auto"}
            w={"45%"}
            h={"100%"}
            boxShadow={"dark-lg"}
            borderRadius={"20px"}
            overflow={"auto"}
            css={{
              "&::-webkit-scrollbar": {
                width: "0px",
              },
            }}
          >
            <CardBody w={"100%"}>
              <Menu>
                <MenuButton as={Button}>Rooms Menu</MenuButton>
                <MenuList>{renderRooms}</MenuList>
              </Menu>
              {currRoom ? (
                <>
                  <Text
                    color={"#e5edff"}
                    align={"center"}
                    fontWeight={"bold"}
                    fontSize={"2xl"}
                    mt={5}
                  >
                    Question : {currRoom.question}
                  </Text>
                  <VStack w={"100%"} mt={5}>
                    <Button
                      onClick={voteA}
                      w={"100%"}
                      bg={"#5e52d9"}
                      color={"#b1bdff"}
                      _hover={{ bg: "#5e32d9", color: "gray.200" }}
                    >
                      A. {currRoom.optA}
                    </Button>
                    <Button
                      onClick={voteB}
                      w={"100%"}
                      color={"#b1bdff"}
                      _hover={{ bg: "#5e32d9", color: "gray.200" }}
                      bg={"#5e52d9"}
                    >
                      B. {currRoom.optB}
                    </Button>
                  </VStack>
                  <Divider orientation="horizontal" mt={3} />
                  <Text
                    color={"#e5edff"}
                    align={"center"}
                    fontWeight={"bold"}
                    fontSize={"xl"}
                    mt={0}
                    pt={0}
                  >
                    Poll Statistics
                  </Text>
                  <Chart
                    optA={currRoom.optA}
                    optB={currRoom.optB}
                    countA={currRoom.countA}
                    countB={currRoom.countB}
                  />
                  {currRoom.isTimeOut ? (
                    <VStack mt={2}>
                      <Text
                        color={"#e5edff"}
                        align={"center"}
                        fontWeight={"bold"}
                        fontSize={"xl"}
                        mt={0}
                        pt={0}
                      >
                        Poll Ends in :
                      </Text>
                      <Timer
                        endTime={currRoom.endTime}
                        duration={currRoom.duration}
                      />
                    </VStack>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </CardBody>
            <CardFooter p={0} mt={0}>
              <HStack justify={"space-between"} w={"100%"} pl={2} pr={2} mb={2}>
                <Text color={"#e5edff"} fontSize={"sm"}>
                  Current Room ID :{" "}
                  {currRoom ? currRoom.id : "No Room Selected"}
                </Text>
                <Text color={"#e5edff"} fontSize={"sm"}>
                  Total Votes :{" "}
                  {currRoom ? currRoom.countA + currRoom.countB : 0}
                </Text>
              </HStack>
            </CardFooter>
          </Card>
          <Card
            mr={"auto"}
            w={"45%"}
            h={"100%"}
            overflow={"auto"}
            css={{
              "&::-webkit-scrollbar": {
                width: "0px",
              },
            }}
            mt={0}
            boxShadow={"dark-lg"}
            borderRadius={"20px"}
            bgGradient={"linear(to-br, #0f0f0f, #1a1a40, #23235b)"}
          >
            <CardHeader color={"gray.200"}>Create Your Room</CardHeader>
            <CardBody ml={"auto"} mr={"auto"}>
              <Input
                placeholder="Post your question"
                mb={"4px"}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
                color={"gray.200"}
              />
              <Input
                placeholder="Set Option A"
                mb={"4px"}
                onChange={(e) => {
                  setOptA(e.target.value);
                }}
                color={"gray.200"}
              />
              <Input
                placeholder="Set Option B"
                mb={"4px"}
                onChange={(e) => {
                  setOptB(e.target.value);
                }}
                color={"gray.200"}
              />
              <Stack>
                <Checkbox
                  colorScheme={"green"}
                  isChecked={isTimeOut}
                  onChange={handleCheckbox}
                  color={"gray.200"}
                >
                  Timed Poll
                </Checkbox>
                {isTimeOut ? (
                  <HStack>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      defaultValue={1}
                      onChange={(val) => {
                        setDuration(val);
                      }}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb bg={"purple.200"} />
                    </Slider>
                    <Text color={"gray.400"} fontSize={"sm"}>
                      Duration : {duration} minutes
                    </Text>
                  </HStack>
                ) : (
                  <></>
                )}
              </Stack>
              <Box display={"flex"} justifyContent={"center"} mt={2}>
                <Button
                  bg={"blue.300"}
                  onClick={handleCreateRoom}
                  ml={"auto"}
                  mr={"auto"}
                  h={8}
                >
                  Create
                </Button>
              </Box>
            </CardBody>
          </Card>
        </HStack>
      </Box>
    </>
  );
};

export default Dashboard;
