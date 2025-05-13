import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getSocket, sendMessage } from "../utils/socket";
import { useNavigate } from "react-router-dom";

const Login = ({ socket }) => {
  const [user, setUser] = useState(null);
  // const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const res = getSocket();
  //   setSocket(res);
  // }, []);

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Response from server:", data);
      if (data.type != "LOGIN") return;

      if (data.success) {
        localStorage.setItem("userRooms", data.data);
        navigate("/dashboard");
      }
    };
  }, [socket]);

  const handleChange = (e) => {
    setUser(e.target.value);
  };
  const handleClick = async () => {
    if (!user?.trim()) return;
    const payload = {
      type: "LOGIN",
      payload: user,
    };
    console.log("Sending to server...", payload);
    await sendMessage(payload);
    localStorage.setItem("username", user);
  };
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
        alignContent={"center"}
      >
        <Card
          bg={"HEX:#ffffff"}
          bgGradient={"linear(to-b, #c9f0f8, #d7f4fb, #f8fcff, #fcfefd)"}
          mx={"auto"}
          mt={"auto"}
          mb={"auto"}
          w={["250px", "300px", "450px", "500px"]}
          variant={"filled"}
          shadow={"2xl"}
        >
          <CardHeader p={0} ml={"auto"} mr={"auto"} mb={0}>
            <Text
              fontWeight={"bold"}
              fontSize={"5xl"}
              color={"#575a5f"}
              mb={"0px"}
            >
              Welcome!!
            </Text>
          </CardHeader>
          <CardBody>
            <Text align={"center"} color={"gray.500"} mb={"8px"}>
              Jump in, vote live, and see results unfold instantly — your
              opinion matters!
            </Text>
            <Input
              placeholder="Enter Your Username"
              type="text"
              onChange={handleChange}
            />
          </CardBody>
          <CardFooter p={4}>
            <Button
              bg={"#24242e"}
              color={"gray.300"}
              _hover={{ cursor: "pointer", bg: "gray.600" }}
              onClick={handleClick}
              ml={"auto"}
              mr={"auto"}
              w={"75%"}
              h={8}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </Box>
    </>
  );
};

export default Login;
