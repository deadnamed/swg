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
    const boxRef = React.useRef<HTMLTextAreaElement>(null!)
    const messageRef = React.useRef<HTMLInputElement>(null!)
    const submitRef = React.useRef<HTMLInputElement>(null!)


    React.useEffect(()=>{
        messageRef.current.focus();
        messageRef.current.onkeyup = function(e) {
            if (e.key === 'Enter') {  // enter, return
                submitRef.current.click();
            }
        };

        socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            boxRef.current.value += (data.message + '\n');
        };
    
        socket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
    
    })

    const submit = (e: any) => {
        const messageInputDom = messageRef.current;
        const message = messageInputDom.value;
        socket.send(JSON.stringify({
            'message': message
        }));
        messageInputDom.value = '';
    };

    return (
    <div className='App_v4' style={{...{

    }, ...props.style}}>
            <textarea id="chat-log" ref={boxRef} cols={100} rows={20}></textarea>
            <input id="chat-message-input" ref={messageRef} type="text" size={100} />
            <input id="chat-message-submit" type="button" ref={submitRef} value="Send" onClick={submit}></input>
    </div>
    )
}