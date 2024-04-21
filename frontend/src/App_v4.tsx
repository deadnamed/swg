import React, {useState, useRef, useEffect} from 'react';
import { useParams } from "react-router-dom";
import { w3cwebsocket } from 'websocket';
import './App_v4.css'

export interface App_v4Props {
    style: any;
}

App_v4.defaultProps = {
    style: {},
}

export default function App_v4 (props: App_v4Props){
    const { roomId } = useParams();
    const socket = new WebSocket(
        'ws://'
        + "127.0.0.1:8000"
        + '/ws/wordgame_v4/'
        + roomId
        + '/'
    );
    const boxRef = React.useRef<HTMLParagraphElement>(null!)
    const messageRef = React.useRef<HTMLParagraphElement>(null!)
    const submitRef = React.useRef<HTMLDivElement>(null!)


    React.useEffect(()=>{
        messageRef.current.focus();
        messageRef.current.onkeyup = function(e) {
            if (e.key === 'Enter') {  // enter, return
                submitRef.current.click();
            }
        };

        socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            boxRef.current.innerText += (data.message);
        };
    
        socket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
    
    })

    const submit = (e: any) => {
        const messageInputDom = messageRef.current;
        const message = messageInputDom.innerText;
        if(message.length == 1){
            socket.send(JSON.stringify({
                'message': message
            }));
            messageInputDom.innerText = '';
        }
        else{
            alert("Please only enter 1 character.")
        }
    };

    return (
    <div className='App_v4' style={{...{

    }, ...props.style}}>
            <p id="Word" ref={boxRef} style={{
                fontSize: 60,
                color: "#ffffdd",
            }}> </p>
            <div style={{
                display: "flex",
                
            }}>
                <p id="LetterInput" ref={messageRef} contentEditable style={{
                    height: 40,
                    width: 40,
                    background: "#444444",
                    borderRadius: 10,
                    margin: 0,
                    marginRight: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}/>
                <div id="MoveSubmit" ref={submitRef} onClick={submit} style={{
                    backgroundColor: "#444444",
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 10,
                    height: 40,
                    width: "fit-content",
                    display: "flex",
                    alignItems: "center",
                }}>
                    <p style={{

                    }}>Submit move</p>
                </div>
            </div>
    </div>
    )
}