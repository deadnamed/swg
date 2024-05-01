import React, {useState, useRef, useEffect} from 'react';
import { useParams } from "react-router-dom";
import { w3cwebsocket } from 'websocket';
import './App_v4.css'
import axios from 'axios';

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
        + localStorage.getItem("auth_token")
    );
    const boxRef = React.useRef<HTMLParagraphElement>(null!)
    const cutoffRef = React.useRef<HTMLParagraphElement>(null!)
    const messageRef = React.useRef<HTMLParagraphElement>(null!)
    const submitRef = React.useRef<HTMLDivElement>(null!)
    const playersRef = React.useRef<HTMLParagraphElement>(null!)
    const [isMyTurn, setIsMyTurn] = React.useState(true)
    const [word, setWord] = React.useState("")
    let playerName = ""
    let opponentName = ""

    React.useEffect(()=>{
        messageRef.current.focus();
        messageRef.current.onkeyup = function(e) {
            if (e.key === 'Enter') {  // enter, return
                submitRef.current.click();
            }
        };

        socket.onopen = ()=>{socket.send(JSON.stringify({
            "type": "data_request",
            "message": "",
            "sent_by": localStorage.getItem("auth_token")
        }))}

        socket.onmessage = function(e) {
            console.log("message received", JSON.parse(e.data))
            const data = JSON.parse(e.data);
            if(data.type == "opponent_move"){
                setWord((word)=>(word + (data.message)));
                setIsMyTurn(isMyTurn => !isMyTurn)
            }
            else if (data.type == "info_response"){
                console.log("response received")
                axios.get(`http://localhost:8000/wordgame_v4/user/${localStorage.getItem("auth_token")}`, {})
                .then(function(response){
                    if(response.data == "no user"){
                        window.location.href = "http://localhost:5173" + "login/"
                    }
                    else{
                        playerName = response.data
                        console.log("player name: ", playerName, "planned opponent name: ", data.message)
                        if (data.message != playerName){
                            console.log("opp name: ", data.message)
                            opponentName = data.message
                            playersRef.current.innerText = `Players: ${playerName} (you), ${opponentName} (opponent)`
                        }
                    }
                })
                setIsMyTurn(data.my_turn)
                setWord(data.word)
            }
            else if (data.type == "opponent_joined"){
                axios.get(`http://localhost:8000/wordgame_v4/user/${localStorage.getItem("auth_token")}`, {})
                .then(function(response){
                    if(response.data == "no user"){
                        window.location.href = "http://localhost:5173" + "login/"
                    }
                    else{
                        playerName = response.data
                        console.log("player name: ", playerName, "planned opponent name: ", data.message)
                        if (data.message != playerName){
                            console.log("opp name: ", data.message)
                            opponentName = data.message
                            playersRef.current.innerText = `Players: ${playerName} (you), ${opponentName} (opponent)`
                        }
                    }
                })
            }
        };
    
        socket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
        
        axios.get(`http://localhost:8000/wordgame_v4/user/${localStorage.getItem("auth_token")}`, {})
        .then(function(response){
            if(response.data == "no user"){
                window.location.href = "http://localhost:5173" + "login/"
            }
            else{
                playerName = response.data
                playersRef.current.innerText = `Players: ${playerName} (you)`
            }
        })
    }, [])

    const submit = (e: any) => {
        const messageInputDom = messageRef.current;
        const message = messageInputDom.innerText;

        const cutoffInputDom = messageRef.current;
        const cutoffNumber = cutoffInputDom.innerText;
        if(message.length != 1){
            alert("Please only enter 1 character.")
            return
        }
        const cutoff = parseInt(cutoffNumber)
        if(isNaN(cutoff) && cutoffNumber != ""){
            alert("Please enter a valid cutoff number.")
            return
        }
        socket.send(JSON.stringify({
            'type': "opponent_move",
            'message': message,
            'cutoff': cutoff,
            'sent_by': localStorage.getItem("auth_token"),
        }));
        messageInputDom.innerText = '';
    };

    return (
    <div className='App_v4' style={{...{

    }, ...props.style}}>
            <p>Room name: {roomId}</p>
            <p ref={playersRef}>Players:</p>
            <p id="Word" style={{
                fontSize: 60,
                color: "#ffffdd",
            }}> 
                {word}
            </p>
            <div style={{
                display: "flex",
                
            }}>
                <p id="CutoffInput" ref={cutoffRef} contentEditable={isMyTurn} style={{
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
                <p id="LetterInput" ref={messageRef} contentEditable={isMyTurn} style={{
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