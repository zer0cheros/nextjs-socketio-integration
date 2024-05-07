'use client'
import React, { useEffect, useState } from 'react';
import io, {Socket} from 'socket.io-client';
let socket: Socket;

    export default function Game({ id }: { id: string }) {
      const [msg, setMsg] = useState<string>('');
      useEffect(() => {
        if (!socket || !socket.connected) {
          socket = io();
        }
        socket.emit('join-room', { id:id, msg: msg });
        socket.on('chat', (data) => {
          setMsg(data);
        });
        return () => {
          socket.disconnect();
        };
      }, []);
      return (
        <>
          <h1>Room: {id}</h1>
          <textarea cols={40} rows={20} value={msg} onChange={({target})=> socket.emit('chat', { id: id, msg: target.value })} />
        </>
      );
    }
