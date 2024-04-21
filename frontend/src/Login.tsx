import React, {useState, useRef, useEffect} from 'react';
import './Login.css'
import axios from 'axios';

export interface LoginProps {
    style: any;
}

Login.defaultProps = {
    style: {},
}

export default function Login (props: LoginProps){
    const usernameRef = React.useRef<HTMLParagraphElement>(null!)
    const passwordRef = React.useRef<HTMLParagraphElement>(null!)
    const submitRef = React.useRef<HTMLDivElement>(null!)

    const submit = ()=>{
        axios.get(`http://localhost:8000/wordgame_v4/login/${usernameRef.current.innerText}/${passwordRef.current.innerText}`, {})
        .then((response)=>{
            if(response.data == "no user"){
                alert("no user")
            }
            else if(response.data == "wrong password"){
                alert("wrong password")
            }
            else{
                localStorage.setItem("auth_token", response.data)
                console.log(response.data)
                window.location.href = "http://localhost:5173/"
            }
        })
    }

    return (
    <div className='Login' style={{...{
        display: "flex",
        flexDirection: "column",
    }, ...props.style}}>
        <p>log in:</p>
        <div>
            <p style={{
                color: "#444444",
            }}>username: </p>
            <p contentEditable ref={usernameRef}>enter username here </p>
        </div>
        <div>
            <p style={{
                color: "#444444",
            }}>password: </p>
            <p contentEditable id="pass" ref={passwordRef}>enter password here </p>
        </div>
        <div style={{
            padding: 10,
            backgroundColor: "#444444",
            borderRadius: 10,
        }} onClick={submit}>
            submit
        </div>
    </div>
    )
}