import React, {useEffect, useState} from 'react'

export default function Friends({user}) {
    const [friends, setFriends] = useState([])

    useEffect(() => {
        setFriends(user.friendships)
    }, [user.friendships])
    
  return (
    <div className='friends-container'>
        { friends && (friends.length > 0) ? (
                friends.map(friend => {
                    return (
                        <div className="friend-card" key={friend.id}>
                            <p>{friend.name.toUpperCase()}</p>
                            <i>{friend.username}</i>
                        </div>
                    )
                })
            ) : <i className="friend-list-message">No friends</i> }
            
    </div>
  )
}
