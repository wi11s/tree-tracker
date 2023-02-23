import React from "react";
import { useState, useEffect } from "react";
import FriendRequests from './FriendRequests';
import Friends from './Friends';

export default function FriendList({user}) {
    const [requests, setRequests] = useState([]);
    const [showRequests, setShowRequests] = useState(false);
    const [showFriends, setShowFriends] = useState(false);

    useEffect(() => {
        setRequests(user.requests)
    }, [user])

    return (
        <div className="friend-list-container">
            <div className="friend-list">
            <button onClick={() => setShowRequests(!showRequests)}>show friend requests</button>
                { showRequests ? (
                <FriendRequests user={user} requests={requests} setRequests={setRequests}/>
                ) : null }
            <button onClick={() => setShowFriends(!showFriends)}>friends</button>
            { showFriends ? (
            <Friends user={user}/>
            ) : null }
            </div>
        </div>
    )
}