import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Reply({reply, user, postId, setReplies, replies, setParentReplyCount, parentReplyCount}) {
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(reply.like_count)
    const [replyCount, setReplyCount] = useState(reply.reply_count)
    const [expand, setExpand] = useState(false)
    const [nestedReplies, setNestedReplies] = useState([])
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [content, setContent] = useState('')

    const navigate = useNavigate()

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    function handleExpand() {
      if (!expand) {
        fetch(`https://tree-tracker-backend.herokuapp.com/replies/${reply.id}`, {
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
      fetch(`https://tree-tracker-backend.herokuapp.com/replies/${reply.id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(r => r.json())
      .then(data => {
        console.log(data)
        setNestedReplies(data.sort((a, b) => b.like_count - a.like_count).filter(onlyUnique))  
      })
    }, [])

    useEffect(() => {
        fetch(`https://tree-tracker-backend.herokuapp.com/like/reply/${user.id}/${reply.id}`, {
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
            fetch('https://tree-tracker-backend.herokuapp.com/likes', {
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
            fetch(`https://tree-tracker-backend.herokuapp.com/like/reply/${user.id}/${reply.id}`, {
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
      setShowReplyForm(!showReplyForm)
    }

    function handleContentChange(e) {
        setContent(e.target.value)
    }

    function handleReplySubmit(e) {
      e.preventDefault()
      fetch('https://tree-tracker-backend.herokuapp.com/replies', {
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
        fetch('https://tree-tracker-backend.herokuapp.com/join_replies', {
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
            fetch(`https://tree-tracker-backend.herokuapp.com/replies/${reply.id}`, {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('jwt')}`
              }
            })
            .then(r => r.json())
            .then(data => {
              setNestedReplies(data)
              setExpand(true)
              setShowReplyForm(false)
              setContent('')
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
      fetch(`https://tree-tracker-backend.herokuapp.com/replies/${reply.id}`, {
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

            {showReplyForm ? (
              <div className="pop-up-form-container">
                <form className="pop-up-form" onSubmit={handleReplySubmit}>
                  <p>Reply to <span>{reply.user.username} :</span></p>
                  <input type="text" className="pop-up-input" placeholder="Post your reply" onChange={handleContentChange}/>
                  <div className="box">
                    <input type="submit" className="forum-btn reply-btn" value="Reply" />
                  </div>
                  <i className='bx bx-x' onClick={handleReplyClick}></i>
                </form>
              </div>
            ) : null}
            
        {nestedReplies.length > 0 ? (
            nestedReplies.map(reply => {
                return <Reply key={reply.id} user={user} postId={postId} reply={reply} setReplies={setNestedReplies} replies={nestedReplies} parentReplyCount={replyCount} setParentReplyCount={setReplyCount}/>
            })
        ) : null } 
    </div>
  )
}