import React, { useState, useEffect } from 'react'
import Post from './Post'
import { motion } from 'framer-motion'

import { useSelector } from 'react-redux'
import { selectUser } from '../../slices/userSlice'


export default function Home() {

  const user = useSelector(selectUser)

  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
  fetch("/posts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    }
  })
  .then(r => r.json())
  .then(posts => {
    let arrayOfFollowingIds = []
    user.following.map(following => arrayOfFollowingIds.push(following.id))
    let filteredPosts = posts.filter(post => (arrayOfFollowingIds.includes(post.user.id))||(post.user.id===user.id))
    console.log(filteredPosts)
    setPosts(filteredPosts.sort((a, b) => b.created_at - a.created_at))
  })
  }, [user])

  function handleChange(e) {
    setContent(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    fetch('posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: JSON.stringify({
        content: content,
        user_id: user.id
      })
    })
    .then(r => r.json())
    .then(post => {
      if (post.id) {
        setPosts([post, ...posts])
        setContent('')
        setNewPost(false)
      } else {
        console.log(post.error)
        alert(post.exception)
      }
    })
  }

  return (
    <div id="forum">
      <motion.div
        className="box"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0,
          ease: [0, 0.71, 0.2, 1.01]
        }}
      >
        <form onSubmit={handleSubmit} className='newPost'>
          <input className="form-control" type="text" placeholder="What's on your mind?" onChange={handleChange}/>
          <motion.div
            className="box"
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <input className="form-control newPostSubmit" type="submit" value="Post"/>
          </motion.div>
        </form>
        {posts.map(post => {
          return <Post key={post.id} post={post} posts={posts} setPosts={setPosts}/>
        })}
      </motion.div>
    </div>
  )
}