import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Timer = ({ endTime, duration }) => {
  const [timeLeft, setTimeLeft] = useState(
    new Date(endTime).getTime() - Date.now()
  );
  const [percent, setPercent] = useState(
    Math.floor((timeLeft / duration) * 100)
  );
  useEffect(() => {
    // console.log(Date(endTime) - Date.now(), percent);
    const interval = setInterval(() => {
      const newTimeLeft = new Date(endTime).getTime() - Date.now();
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setPercent(0);
        return;
      }
      setTimeLeft(newTimeLeft);
      setPercent(Math.floor((newTimeLeft / (duration * 60 * 1000)) * 100));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, duration]);
  return (
    <>
      <CircularProgress
        value={percent}
        color="green.400"
        size="120px"
        thickness="8px"
      >
        <CircularProgressLabel fontSize={"lg"} color={"gray.200"}>
          {Math.floor(timeLeft / 1000)} sec
        </CircularProgressLabel>
      </CircularProgress>
    </>
  );
};

export default Timer;
