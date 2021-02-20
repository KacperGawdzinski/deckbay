import { useEffect, useRef, useState } from 'react';
import './Charades.css';

const Charades = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const canvasContext = useRef(null);

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
