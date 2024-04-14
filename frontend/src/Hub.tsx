import React, {useState, useRef, useEffect} from 'react';
import './Hub.css'

export interface HubProps {
    style: any;
}

Hub.defaultProps = {
    style: {},
}

export default function Hub (props: HubProps){
    const idRef = React.useRef<HTMLInputElement>(null!)
    const redirect = ()=>{
        window.location.href = window.location.href + "game/" + idRef.current.value + "/"
    }

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