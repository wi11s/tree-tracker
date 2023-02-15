import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Reply({reply, user, postId, setReplies, replies, setParentReplyCount, parentReplyCount}) {
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(reply.like_count)
    const [replyCount, setReplyCount] = useState(reply.reply_count)
    const [expand, setExpand] = useState(false)
    const [nestedReplies, setNestedReplies] = useState(replies)
    const [showReplies, setShowReplies] = useState(false)
    const [content, setContent] = useState('')

    const navigate = useNavigate()

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    function handleExpand() {
      if (!expand) {
        fetch(`/replies/${reply.id}`, {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        })
        .then(r => r.json())
        .then(data => {
          console.log(data)
          setNestedReplies(data.sort((a, b) => b.like_count - a.like_count).filter(onlyUnique))  
          setExpand(true)
        })
      } else {
        setExpand(false)
      }
    }

    useEffect(() => {
        fetch(`/like/reply/${user.id}/${reply.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        })
        .then(r => r.json())
        .then(data => {
        //   console.log(data)
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
                reply_id: reply.id,
                user_id: user.id, 
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
            fetch(`/like/reply/${user.id}/${reply.id}`, {
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

    function handleReplyClick() {
        setShowReplies(!showReplies)
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
          post_id: postId
        })
      })
      .then(r => r.json())
      .then(data => {
        console.log(reply.id, data.id)
        fetch('/join_replies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({
            parent_reply_id: reply.id,
            child_reply_id: data.id
          })
        })
        .then(r => r.json())
        .then((joinData) => {
          console.log(joinData)
          if (data.id) {
            setReplyCount(replyCount => replyCount + 1)
            setContent('')
            fetch(`/replies/${reply.id}`, {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('jwt')}`
              }
            })
            .then(r => r.json())
            .then(data => {
              setNestedReplies(data)
              setExpand(true)
              setShowReplies(false)
            })
          } else {
            alert(data.exception)
          }
        })
      })
    }

    function toViewProfile() {
      navigate(`/profile/${reply.user.id}`)
    }

    function handleDelete() {
      fetch(`/replies/${reply.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(() => {
        setReplies(replies.filter(r => r.id !== reply.id))
        setParentReplyCount(parentReplyCount => parentReplyCount - 1)
      })

      
    }
    
  return (

    <div className='replyDiv'>
            <div className="reply-container">
              <div className="card-header" onClick={toViewProfile}>
                  {reply.user.username} :
              </div>

              {user.id===reply.user.id ? <i className='bx bx-x' id="reply-x" onClick={() => handleDelete(reply.id)} /> : null}

              <p className='postContent reply-content'>{reply.content}</p>
          
                <div className="post-icons-container reply-icons-container">
                  <div className="post-icons">
                    {liked ? <i className='bx bxs-heart' onClick={handleClick}></i> : <i className='bx bx-heart' onClick={handleClick}></i>}
                    <p>{likes}</p>
                  </div>

                  <div className="post-icons">
                    <i className='bx bx-message-square-dots' onClick={handleReplyClick}></i>
                    <p>{replyCount}</p>
                  </div>
                </div>
        
            </div>

            {showReplies ? (
              <form className="replyForm" onSubmit={handleReplySubmit}>
                <input type="text" className="form-control-reply form-control" placeholder="Reply to this common" onChange={handleContentChange}/>
                <motion.div
                  className="box"
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <input type="submit" className="forum-btn reply-btn" value="Reply" />
                </motion.div>
              </form>
            ) : null}
        {expand ? (
            nestedReplies.map(reply => {
                return <Reply key={reply.id} user={user} postId={postId} reply={reply} setReplies={setNestedReplies} replies={nestedReplies} parentReplyCount={replyCount} setParentReplyCount={setReplyCount}/>
            })
        ) : null } 
    </div>
  )
}