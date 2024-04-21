import React, {useState, useRef, useEffect} from 'react';
import './Hub.css'
import axios from 'axios';

export interface HubProps {
    style: any;
}

Hub.defaultProps = {
    style: {},
}

export default function Hub (props: HubProps){
    const idRef = React.useRef<HTMLInputElement>(null!)
    const accountNameRef = React.useRef<HTMLParagraphElement>(null!)
    const redirect = ()=>{
        window.location.href = window.location.href + "game/" + idRef.current.value + "/"
    }
    React.useEffect(()=>{
        if (localStorage.getItem("auth_token") == null) {
            window.location.href = window.location.href + "login/"
        }
        else{
            axios.get(`http://localhost:8000/wordgame_v4/user/${localStorage.getItem("auth_token")}`, {})
            .then(function(response){
                if(response.data == "no user"){
                    window.location.href = window.location.href + "login/"
                }
                else{
                    accountNameRef.current.innerText += " " + response.data
                }
            })
        }
    })
    return (
    <div className='App' style={{...{
        display: "Flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
        fontSize: 40,
    }, ...props.style}}>
        <p ref={accountNameRef}>Current account:  </p>
        <p>Enter the ID of the room you want to join: </p>
        <input id="room-name-input" type="text" size={40} style={{
            fontSize: 40,
            margin: 40,
            textAlign: "center",
        }} ref={idRef}/>
        <div style={{
            padding: 10,
            paddingLeft: 15,
            paddingRight: 15,
            marginTop: 40,
            backgroundColor: "#222222",
            borderRadius: 10,
        }} onClick={redirect}>
            Submit
        </div>
    </div>
    )
}