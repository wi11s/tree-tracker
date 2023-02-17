import React from 'react'

export default function FriendRequests({user, requests}) {
    console.log(requests)

    function handleAccept(id) {
        
    }

    function handleDecline(id) {

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
