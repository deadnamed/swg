import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";



function App(props: any) {
    let client = new W3CWebSocket('ws://127.0.0.1:8000/ws/' + props.room + '/'); //gets room_name from the state and connects to the backend server 
    return({

    })
}