import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import PermanentDrawerLeft from "./components/frame/PermanentDrawerLeft";

const ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT;

function App() {
  const [health, setHealth] = useState("");

  useEffect(() => {
    console.log('Connecting to', ENDPOINT);
    const newSocket = io(ENDPOINT);

    newSocket.on('connect', () => console.log('client connected ', newSocket.id));
    newSocket.on('connect_error', () => {
      console.log('Connect error. Will try reconnect in 5s...')
      setTimeout(() => newSocket.connect(), 5000);
    });
    newSocket.on('disconnect', () => console.log('client disconnected ', newSocket.id));

    // CLEAN UP THE EFFECT
    return () => {
      console.log('Disconnecting', newSocket.id);
      newSocket.disconnect();
  }

  }, []);

  // TODO move this to about page
  const checkHealth = async () => {
    const res = await fetch('/json/health');
    if (res.ok) {
      const data = await res.json();
      setHealth(JSON.stringify(data));
    } else { console.log('fetch error', res) }
  }

  const query = socket => {
    console.log('FromClient.Query')
    socket.emit('FromClient.Query', 'WHEAT|MONTHLY')
  }

  return (
    <div>
      <PermanentDrawerLeft></PermanentDrawerLeft>
    </div>
  );
}

export default App;