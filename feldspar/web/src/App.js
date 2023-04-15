import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const BASE_URI = 'http://127.0.0.1';
const ENDPOINT = `${BASE_URI}:4001`;

function App() {
  const [socket, setSocket] = useState(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    newSocket.on('connect', () => console.log('client connected ', newSocket.id));
    newSocket.on('connect_error', () => {
      setTimeout(() => newSocket.connect(), 5000);
    });
    newSocket.on('disconnect', () => console.log('client disconnected ', newSocket.id));
    newSocket.on("FromServer.Command", data => {
      setResponse(data);
    });


    // CLEAN UP THE EFFECT
    return () => newSocket.disconnect();

  }, [setSocket]);

  const query = socket => {
    console.log('FromClient.Query')
    socket.emit('FromClient.Query', 'WHEAT|MONTHLY')
  }

  return (
    <div>
      <button onClick={() => query(socket)}>query</button>
      <p>
        hi {response}
      </p>
    </div>
  );
}

export default App;