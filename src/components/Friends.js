import React, {useState} from 'react'

export default function Friends({user}) {
    const [friends, setFriends] = useState(user.friendships)

  return (
    <div>
        {
            friends && (friends.length > 0) ? (
                <div>
                    {friends.map(friend => {
                        return (
                            <div key={friend.id}>
                                <h1>{friend.username}</h1>
                            </div>
                        )
                    })}
                </div>
            ) : null
        }
    </div>
  )
}
