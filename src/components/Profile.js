import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TreeCard from './TreeCard';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { set, selectUser } from '../slices/userSlice'

import { NavLink } from 'react-router-dom';
import FriendRequests from './FriendRequests';
import Friends from './Friends';

export default function ({ treeTypes, userTrees, user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  
  const [points, setPoints] = useState(0)
  const [requests, setRequests] = useState([])
  const [showRequests, setShowRequests] = useState(false)
  const [showFriends, setShowFriends] = useState(false)

  useEffect(() => {
    setRequests(user.requests)
  }, [user])

  function handleClick() {
    navigate('/')
    localStorage.removeItem("jwt");
    const nullUser = {
      id: null,
      name: null,
      username: null,
      email: null,
      tree_types: [],
      requests: [],
      friendships: [],
      user_trees: [],
      posts: [],
      score: null
    }
    dispatch(set(nullUser));
  }
  
  
   const sortedTreeTypes = treeTypes.sort((a, b) => {
      const rarityOrder = {verycommon: 0, common: 1, uncommon: 2, rare: 3, veryrare: 4}
      return rarityOrder[a.frequency.replace(/ +/g, "")] - rarityOrder[b.frequency.replace(/ +/g, "")]
  })

  console.log(user.score)
  return (
    <div className="profile" id='top'>
        {/* <button onClick={() => setShowRequests(!showRequests)}>show friend requests</button>
        { showRequests ? (
          <FriendRequests user={user} requests={requests} setRequests={setRequests}/>
        ) : null }
        <button onClick={() => setShowFriends(!showFriends)}>friends</button>
        { showFriends ? (
          <Friends user={user}/>
        ) : null } */}
      <div className="profile-container">
        <motion.div initial={{ opacity: 0, y: 10 }} 
                    whileInView={{ opacity: 1, y: 0}} 
                    transition={{ duration: .3, delay: 0 }} 
                    viewport={{ once: true }}
                    className="user-profile-container">
          <div className="user-info-island">
            <div className="user-info">
              <div className="profile-header">
                <h1>{user.name.toUpperCase()}</h1>
                <i>{user.username}</i>
              </div>

              <div className="user-email">
                <p>{user.email}</p>
              </div>              
            </div>

            <div className="profile-logout" onClick={handleClick}>
              <i className='bx bx-log-out'></i>
            </div>
          </div>

          <div className="score-island">
              <p>Score</p>
              <h3>{user.score || 0}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} 
                    whileInView={{ opacity: 1, y: 0}} 
                    transition={{ duration: .3, delay: 0.3 }} 
                    viewport={{ once: true }}
                    className="progress-container">
            <div className="progress-header">
              <h1>PROGRESS</h1>
              <div className="progress-count">
                <p>{userTrees.length} / {treeTypes.length}</p>
              </div>
            </div>

            <div className="tree-card-container">
              {treeTypes.length !== 0 
              ? 
              (sortedTreeTypes.map(tree => {
                  return <TreeCard key={tree['common_name']} tree={tree} />
              }))
              : 
              null
                }
            </div>

            <div className="back-to-top">
              <a href='#top' className='button' style={{textAlign: 'center'}}>
                <p>Back To Top</p>
              </a>
            </div>
        </motion.div>
        
      </div>
    </div>
  )
}
