import React, { useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import config from '../config.json';

const SSWebSocket = (props) => {
    const profileData = JSON.parse(window.localStorage.getItem("profile"));
    const fullUrl = config["websocketurl"] + profileData["user_id"];
    console.log(fullUrl);
    const client = new W3CWebSocket(fullUrl);

    useEffect(() => {
        console.log("client.readyState: ", client.readyState);
        client.onopen = () => {
            console.log('WebSocket Client Connected');
            console.log("client.readyState: ", client.readyState);

            client.send(JSON.stringify({ "action": "presence", "payload": { "action": "subscribe" } }));
        };
        client.onmessage = (message) => {
            console.log(message.data);
            const jsonData = JSON.parse(message.data);
            console.log(jsonData["action"]);
            switch (jsonData["action"]) {
                case "presence":
                    console.log(jsonData["payload"]["action"]);
                    if (jsonData["payload"]["action"] === "status") {
                        if (jsonData["payload"]["type"] == "online") {
                            console.log(jsonData["payload"]["from"] + "  came online");
                            props.onUserCameOnline(jsonData["payload"]["from"]);
                        }
                        else {
                            console.log(jsonData["payload"]["from"] + "  went offline");
                            props.onUserWentOffline(jsonData["payload"]["from"]);
                        }
                    }
                    else if (jsonData["payload"]["action"] === "roster") {
                        console.log(jsonData["payload"]["members"]);
                    }
                    break;

                case "sendmessage":
                    if (jsonData["payload"]["type"] === "chat") {
                        props.onNewChatMessage(jsonData["payload"]["to"], jsonData["payload"]["from"], jsonData["payload"]["body"]);
                    }
                    break;
            }
        };
        console.log("SSWebSocket subscribe");

        return () => {
            console.log("SSWebSocket unsubscribe");
            client.close();
        }
    }, []);

    const enqueForMentorship = ({ mentorId, message }) => {
        if (client.readyState === WebSocket.OPEN) {
            const profileData = JSON.parse(window.localStorage.getItem("profile"));
            const data = {
                "action": "mentor",
                "payload": {
                    "mentor": mentorId,
                    "action": "enqueue",
                    "members": [
                        {
                            "user_id": profileData["user_id"],
                            "message": message
                        }
                    ]
                }
            };

            client.send(JSON.stringify(data));

            return true;
        }

        return false;
    };

    const sendChat = (props) => { // to and message in props
        if (client.readyState === WebSocket.OPEN) {
            const data = { "action": "sendmessage", "payload": { "to": props.to, "body": props.message, "type": "chat" } };
            client.send(JSON.stringify(data));

            return true;
        }

        return false;
    };

    return (<React.Fragment></React.Fragment>);
};

export default SSWebSocket;