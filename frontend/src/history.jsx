import React, { useState } from "react";
import io from 'socket.io-client';


const socket = io('http://localhost:5001', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ["websocket"]
});


const Modal = ({open, onClose}) => {
    const [userName, setUserName] = useState('');

    if (!open) return null; 


    const addUser = async () => {
        socket.emit('gameWin', userName);
        socket.on('hisRes', (data) => {

        document.getElementById('history').innerHTML = data.map(data => 
            `<div>
                <div>Name: ${data.Name}</div>
                <div>Win: ${data.Win}</div>
                <div>Cards: ${data.Cards}</div>
                <br><br>
            </div>`
        ).join('');
        });
    };

    
    return(
            <div className="popUp">
                <div className="modalContainer">
                    <p onClick={onClose} className="txt">X</p>
                    <br></br>
                    <h1>History</h1>
                    <input type = "text" value={userName} onChange={(event) => setUserName(event.target.value)}/>
                    <button onClick={addUser}>Submit</button>
                    <h3 id="history"></h3>
                </div>
            </div>
    );
    
};

export default Modal; 