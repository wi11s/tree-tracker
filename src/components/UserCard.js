import React, {useEffect, useState} from 'react'

export default function UserCard({displayUser, user}) {
    // console.log(displayUser)
    const [requested, setRequested] = useState(displayUser.requested)
    const [alreadyFriends, setAlreadyFriends] = useState(false)

    useEffect(() => {
        if (user && user.friendships) {
            if (user.friendships.map(friend => friend.id).includes(displayUser.id)) {
                console.log('already friends')
                setAlreadyFriends(true)
            }
        }

    }, [user])
    
    console.log(user)

    function handleFriendRequest(id) {
        fetch('/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                sender_id: user.id,
                receiver_id: id
            })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            setRequested(true)
        })
    }

  return (
        <div className="friend-card suggest-friend-card">
            <div className="friend-card-info">
                <p>{displayUser.name.toUpperCase()}</p>
                <i>{displayUser.username}</i>
            </div>
        
            { !alreadyFriends ? (
                requested ? <i>Request Sent</i> : (
                <k className='bx bx-message-square-add' onClick={() => handleFriendRequest(displayUser.id)}></k> )
            ) : null }
        </div>    
  )
}
