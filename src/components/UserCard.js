import React, {useState} from 'react'

export default function UserCard({displayUser, user}) {
    // console.log(displayUser)
    const [requested, setRequested] = useState(displayUser.requested)

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
    <div className='user-card'>
        <h3>{displayUser.username}</h3>
        {requested ? <p>Friend Request Sent</p> : (
            <button onClick={() => handleFriendRequest(displayUser.id)}>Add Friend</button>
        )}
    </div>
  )
}
