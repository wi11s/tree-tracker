import React, { useState, useEffect } from 'react';
import Replies from './Replies';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Post({post, username, user, setPosts, posts}) {
  // console.log(post)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes_count)
  const [replyCount, setReplyCount] = useState(post.initial_replies.length)
  const [expand, setExpand] = useState(false)
  const [replies, setReplies] = useState(false)
  const [content, setContent] = useState('')
  const [replyingState, setReplyingState] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`/like/${user.id}/${post.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      }
    })
    .then(r => r.json())
    .then(data => {
      // console.log(data)
      if (data) {
        setLiked(true)
      }
    })
  }, [localStorage.getItem("jwt")])

  function handleClick() {
    if (liked === false) {
      fetch('likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          post_id: post.id,
          user_id: user.id
        })
      })
      .then(r => r.json())
      .then(data => {
        console.log(data)
        setLiked(true)
        let newLikes = likes + 1
        setLikes(newLikes)
      })
    } else
      fetch(`/like/${user.id}/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(() => {
        setLiked(false)
        let newLikes = likes - 1
        setLikes(newLikes)
      })
  }

  function handleExpand() {
    setExpand(!expand)
  }

  function handleReplyClick() {
    setReplies(!replies)
  }

  function handleContentChange(e) {
    setContent(e.target.value)
  }

  function handleReplySubmit(e) {
    e.preventDefault()
    fetch('/replies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        content: content,
        user_id: user.id,
        post_id: post.id
      })
    })
    .then(r => r.json())
    .then(data => {
      console.log(data)
      if (data.id) {
        setExpand(true)
        setReplyingState(!replyingState)
        setReplyCount(replyCount => replyCount + 1)
        setReplies(false)
      } else {
        alert(data.exception)
      }
    })
  }

  function toViewProfile() {
    navigate(`/profile/${post.user.id}`)
  }

  function handleDelete() {
    fetch(`/posts/${post.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })
    .then(r => r.json())
    .then(data => {
      console.log(data)
    })

    setPosts(posts.filter(p => p.id !== post.id))
  }

  return (

    <div className="post">

      <div className='cardAtHome'>
        <div className="card-home-upper">
          <div className="wrapper">
            <div className="card-header" onClick={toViewProfile}>
              {username} 
            </div>
            <motion.div
              className="box"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                {post.user.id === user.id ? <div className="btn btn-danger delete-post" onClick={() => handleDelete(post.id)}><p>x</p></div> : null}
            </motion.div>
          </div>
        
          <div className="card-body-home">
            <blockquote className="blockquote mb-0">
              <p className='postContent'>{post.content}</p>
            </blockquote>
          </div>
        </div>
        <p onClick={handleExpand} className="replyCount">{likes} {likes===1 ? 'like' : 'likes'} - {replyCount} {replyCount===1 ? 'reply' : 'replies'}</p>
        {/* <p>Created at {post.created_at}</p> */}
       
        <button className='btn likeBtn' onClick={handleClick}>{liked ? '♥' : '♡'}</button>
        <button className='btn replyBtn' onClick={handleReplyClick}>💬</button>
    
      </div>
      <div className='newPost'>
        {replies ? (
          <form className="replyForm" onSubmit={handleReplySubmit}>
            <input type="text" className="form-control-reply form-control" placeholder="Reply to this post" onChange={handleContentChange}/>
            <motion.div
              className="box"
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <input type="submit" className="form-control-reply-button form-control" value="Post" />
            </motion.div>
          </form>
        ) : null}
      </div>

      {expand ? <Replies user={user} postId={post.id} replyCount={replyCount} setParentReplyCount={setReplyCount} parentReplyCount={replyCount}/> : null}

    </div>
  )
}
