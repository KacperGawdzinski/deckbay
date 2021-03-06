import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './Charades.css';
/*
import { Cookies } from 'react-cookie';
const cookies = new Cookies();*/

const Charades = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const canvasContext = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        axios.post('/set-temp-login', {}, { withCredentials: true });
        const socket = io();
        socket.on('connect', async () => {
            //const res = await axios.post('/set-socket-id', {});
            socket.emit('join-new-room', { game: 'charades', room: id });
        });

        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 5;
        canvasContext.current = context;
    }, []);

    const startDrawing = e => {
        canvasContext.current.beginPath();
        canvasContext.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = e => {
        if (!isDrawing) return;
        canvasContext.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        canvasContext.current.stroke();
    };

    const finishDrawing = () => {
        canvasContext.current.closePath();
        setIsDrawing(false);
    };

    return (
        <div className="charadesBackground">
            <div className="charadesContainer">
                <div className="userList"></div>
                <div className="canvas">
                    <canvas
                        ref={canvasRef}
                        width={700}
                        height={700}
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseMove={draw}
                    ></canvas>
                </div>
                <div className="chat"></div>
            </div>
        </div>
    );
};
export default Charades;
