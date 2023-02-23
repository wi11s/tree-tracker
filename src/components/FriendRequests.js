import React from 'react'
import { useDispatch } from 'react-redux'
import { set } from '../slices/userSlice'

export default function FriendRequests({user, requests, setRequests}) {
    console.log(requests)
    const dispatch = useDispatch()

    function handleAccept(request) {
        fetch("/friends", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
            body: JSON.stringify({
                user1_id: request.id,
                user2_id: user.id
            })
        })
        .then(r => r.json())
        .then(obj => {
            // console.log(obj)
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
                    user2_id: request.id
                })
            })
            .then(r => r.json())
            .then(obj => {
                // console.log(obj)

                let newRequests = requests.filter(x => {
                    console.log(x.id, request.id)
                    return x.id !== request.id
                })
                console.log('newRequests')
                setRequests(() => ['dd'])
                dispatch(set({requests: newRequests}))

                let newFriendships = [...user.friendships, request]
                // console.log(newFriendships)
                dispatch(set({friendships: newFriendships}))
            })
            .then(() => {
                fetch(`/requests/${user.id}/${request.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`
                    }
                })
                .catch(err => console.log(err))
            })
        })
    }

    function handleDecline(request) {
        fetch(`/requests/${user.id}/${request.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
        })
        .then(() => {
            let newRequests = requests.filter(x => x.id !== request.id)
            console.log(newRequests)
            setRequests(newRequests)
        })
    }

  return (
    <div className='friends-container request-container'>
        { user.requests && (user.requests.length > 0) ? (
            <>
            {requests.map(request => {
                console.log(request.username)
                return (
                    <div className='friend-card request-friend-card'>
                            <div className="friend-card-info">
                            <p>{request.name.toUpperCase()}</p>
                            <i>{request.username}</i>
                        </div>
                        <div className='friend-request-buttons'>
                            <i className='bx bx-check' onClick={() => handleAccept(request)}></i>
                            <i class='bx bx-x' onClick={() => handleDecline(request)}></i>
                        </div>
                    </div>
                )
            })}
            </>
        ) : <i className="friend-list-message">No requests</i> }
    </div>
  )
}
