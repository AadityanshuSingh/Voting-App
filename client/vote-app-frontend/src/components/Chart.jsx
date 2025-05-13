import { Box, Text, Tooltip, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const VoteBarChart = ({ optA, optB, countA, countB }) => {
  const total = countA + countB || 1;
  const percentA = (countA / total) * 100;
  const percentB = (countB / total) * 100;

  return (
    <VStack
      spacing={4}
      w="100%"
      mt={6}
      bg={"purple.900"}
      p={4}
      borderRadius="20px"
    >
      {[
        { label: optA, count: countA, percent: percentA, color: "blue.200" },
        { label: optB, count: countB, percent: percentB, color: "blue.200" },
      ].map((opt, i) => (
        <Box key={i} w="100%">
          <Tooltip label={`${opt.count} votes`} hasArrow placement="top">
            <Box
              w="100%"
              h="40px"
              bg={"#5e52d8"}
              borderRadius="md"
              overflow="hidden"
              position="relative"
            >
              <MotionBox
                h="100%"
                bg={"#b1b4f0"}
                initial={{ width: 0 }}
                animate={{ width: `${opt.percent}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                display="flex"
              >
                <Text
                  mb={1}
                  fontWeight="semibold"
                  position={"absolute"}
                  pl={2}
                  pt={1.5}
                >
                  {i == 0 ? "A" : "B"}. {opt.label}
                </Text>
              </MotionBox>
            </Box>
          </Tooltip>
        </Box>
      ))}
    </VStack>
  );
};

export default VoteBarChart;
