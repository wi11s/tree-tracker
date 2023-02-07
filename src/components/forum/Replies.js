import React, { useState, useEffect } from 'react'
import Reply from './Reply'

export default function Replies({postId, user, replyCount, setParentReplyCount, parentReplyCount}) {
    const [replies, setReplies] = useState([])
    useEffect(() => {
        fetch(`/posts/replies/${postId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            }
        })
        .then(r => r.json())
        .then(data => {
            // console.log(data)
            setReplies(data)
        })
    }, [replyCount])
    
  return (
    <div>{replies.map(reply => {
        if (reply !== null) {
            return <Reply user={user} postId={postId} key={reply.id} reply={reply} setReplies={setReplies} replies={replies} setParentReplyCount={setParentReplyCount} parentReplyCount={parentReplyCount}/>
        }
    })}</div>
  )
}