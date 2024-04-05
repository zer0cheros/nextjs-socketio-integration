'use client'
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

type SocketProps = {
    on: (d: string, callback: (e: any) => void) => void;
    emit: (d: string, b:any) => void;
}

let socket:SocketProps

export default function Socket() {
    const [messages, setMessage] = useState('')
    useEffect(() => {
        socket = io();
        socket.on('connect', () => {
            console.log('connected');
        });
        socket.on('disconnect', () => {
            console.log('disconnected');
        });
        socket.on('chat', (msg) => {
            setMessage(msg);
        });
    }, []); 

    return (
        <div className='flex flex-col gap-4'>
            <input onChange={(e)=>socket.emit('chat', e.target.value)} type="text" />
            <button>Send</button>
            <h1>{messages}</h1>
        </div>
    );
}
