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
        });
        // document.getElementById('history').innerHTML = test.map(record => 
        //     `<tr>
        //         <td>Name${record.Name}</td>
        //         <td>Win: ${record.Loser}</td>
        //         <td>Cards: ${record.Cards}</td>
        //         <br><br>
        //     </tr>`
        // ).join('');
        console.log(test);
    };

    
    return(
            <div className="popUp">
                <div className="modalContainer">
                    <p onClick={onClose} className="txt">X</p>
                    <br></br>
                    <h1>History</h1>
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