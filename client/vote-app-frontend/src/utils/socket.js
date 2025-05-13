let socket = null;
let connectedPromise = null;

export const initSocket = () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(import.meta.env.VITE_SERVER_URL);

    connectedPromise = new Promise((resolve, reject) => {
      socket.onopen = () => {
        console.log("WebSocket connected");
        resolve(socket);
      };
      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        reject(err);
      };
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const sendMessage = async (data) => {
  await connectedPromise;
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
};
