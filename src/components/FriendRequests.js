import React from 'react'

export default function FriendRequests({user, requests, setRequests}) {
    console.log(requests)

    function handleAccept(id) {
        fetch("/friends", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({
                user1_id: id,
                user2_id: user.id
            })
        })
        .then(r => r.json())
        .then(obj => {
            console.log(obj)
        })
        .then(() => {
            fetch("/friends", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                body: JSON.stringify({
                    user1_id: user.id,
                    user2_id: id
                })
            })
        })
        .then(() => {
            fetch(`/requests/${user.id}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`
                }
            })
            .catch(err => console.log(err))
        })
        .then(() => {
            let newRequests = requests.filter(request => request.sender_id !== id)
            setRequests(newRequests)
        })
    }

    function handleDecline(id) {
        fetch(`/requests/${user.id}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then(() => {
            let newRequests = requests.filter(request => request.sender_id !== id)
            setRequests(newRequests)
        })
    }

  return (
    <div className='friend-requests'>
        {
            user.requests && (user.requests.length > 0) ? (
                <div>
                {requests.map(request => {
                    console.log(request.username)
                    return (
                        <div className='friend-request-container'>
                        <div className='friend-request-info'>
                            <h3>{request.username}</h3>
                        </div>
                        <div className='friend-request-buttons'>
                            <button className='accept' onClick={() => handleAccept(request.id)}>Accept</button>
                            <button className='decline' onClick={() => handleDecline(request.id)}>Decline</button>
                        </div>
                        </div>
                    )
                })}
                </div>
            ) : null
        }
    </div>
  )
}
