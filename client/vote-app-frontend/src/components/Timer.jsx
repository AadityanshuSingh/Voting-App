import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Timer = ({ endTime, duration }) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(new Date(endTime).getTime() - Date.now(), 0)
  );

  const [percent, setPercent] = useState(
    Math.floor((timeLeft / duration) * 100)
  );
  const [progressColor, setProgressColor] = useState("green.400");
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
      const newPercent = Math.floor(
        (newTimeLeft / (duration * 60 * 1000)) * 100
      );
      setPercent(newPercent);
      if (newPercent >= 75) {
        setProgressColor("green.400");
      } else if (newPercent >= 50) {
        setProgressColor("yellow.400");
      } else if (newPercent >= 25) {
        setProgressColor("orange.400");
      } else if (newPercent >= 10) {
        setProgressColor("red.400");
      } else {
        setProgressColor("red.600");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, duration]);
  return (
    <>
      <CircularProgress
        value={percent}
        color={progressColor}
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
