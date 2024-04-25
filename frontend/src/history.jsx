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
    let test; 
    if (!open) return null; 


    const addUser = async () => {
        socket.emit('gameWin', userName);
        socket.emit('historyRes');
        socket.on('hisRes', (data) => {
            test = data;
            document.getElementById('history').innerHTML = test.map(record => 
                `<tr>
                    <td>Name: ${record.Name}</td>
                    <td>Win: ${record.Loser}</td>
                    <td>Cards: ${record.Cards}</td>
                    <br><br>
                </tr>`
            ).join('');
        });

    };

    
    return(
            <div className="popUp">
                <div className="modalContainer">

                    <p onClick={onClose} className="txt">X</p>
                    <h2>Enter Name</h2>
                    <br></br>
                    <input type = "text" value={userName} onChange={(event) => setUserName(event.target.value)}/>
                    <button onClick={addUser}>Submit</button>

                    <table>
                        <tbody id="history">

                        </tbody>
                    </table>

                </div>

            </div>
    );
    
};

export default Modal; 


/*
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
*/