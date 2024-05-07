'use client'
import React, {useEffect, useRef} from 'react'
import { io } from 'socket.io-client'
import Matter from 'matter-js'
 
export default function Game() {
    const CanvasRef = useRef<HTMLCanvasElement>(null)  
    useEffect(()=>{
        const socket = io()
        const engine = Matter.Engine.create()
        const render = Matter.Render.create({
            canvas: CanvasRef.current || document.createElement('canvas'),
            engine: engine,
            options: {
                width: 1200,
                height: 900,
                wireframes: false,
                background: '#999'
            }
        })
        const circle = Matter.Bodies.circle(600, 400, 30, {
            density: 0.04,
            friction: 0.02,
            frictionAir: 0.0001,
            restitution: 0.6,
            render: { fillStyle: '#F35e66' },
        })
        const ground = Matter.Bodies.rectangle(600, 900, 1200, 60, { isStatic: true, render: { fillStyle: '#212121' } })
        const mouse = Matter.Mouse.create(render.canvas)
        render.mouse = mouse
        const mouseCo = Matter.MouseConstraint.create(engine, {
            mouse,
            constraint: {
                stiffness: 1,
            }
        })
        Matter.World.add(engine.world, [circle, ground, mouseCo])
        Matter.Render.run(render)
        Matter.Engine.run(engine)
        // Skickar position till server
        requestAnimationFrame(function update(){
            socket.emit('update', {position: circle.position, velocity: circle.velocity})
            requestAnimationFrame(update)
        })
        // Lyssnar på positions ändringar från server
        socket.on('update', (data)=>{
            Matter.Body.setPosition(circle, data.position)
            Matter.Body.setVelocity(circle, data.velocity)
        })
        return ()=> {
            Matter.Render.stop(render)
            Matter.Engine.clear(engine)
            socket.disconnect()
        }
    }, [])
  return (
    <canvas ref={CanvasRef}>
    </canvas>
  )
}
