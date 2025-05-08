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

const Login = () => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const res = getSocket();
    setSocket(res);
  }, []);

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
        <Card
          bg={"blue.100"}
          mx={"auto"}
          mt={"auto"}
          mb={"auto"}
          w={"60%"}
          variant={"filled"}
          shadow={"2xl"}
        >
          <CardHeader>
            <Text fontWeight={"bold"} fontSize={"5xl"} color={"ButtonFace"}>
              Welcome!!
            </Text>
          </CardHeader>
          <CardBody>
            <Input
              placeholder="Enter Your Username"
              type="text"
              onChange={handleChange}
            />
          </CardBody>
          <CardFooter p={4}>
            <Button
              bg={"blue.300"}
              _hover={{ cursor: "pointer", bg: "blue.500" }}
              onClick={handleClick}
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
