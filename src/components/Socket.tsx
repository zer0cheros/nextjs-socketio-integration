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
        <div className='flex flex-col p-10 gap-4 min-w-80 max-w-96 bg-slate-200 rounded-md shadow-xl'>
            <h1 className='text-2xl font-semibold'>Socket.IO + NextJS = <span className='text-rose-700'>&#10084;</span> </h1>
            <p>Type to update state for all clients</p>
            <input className='p-2 border-b-2 border-slate-950 bg-slate-200' onChange={(e)=>socket.emit('chat', e.target.value)} type="text" />
            {/* button not in use at this moment */}
            <button className='p-4 bg-slate-950 text-slate-50 rounded-md shadow'>Send</button>
            <h1 className='text-4xl font-semibold m-auto'>{messages}</h1>
        </div>
    );
}
