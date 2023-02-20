import React, { useState, useEffect } from 'react'
import TreeType from './TreeType'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom';
import FriendRequests from './FriendRequests';
import Friends from './Friends';


export default function ({ treeTypes, userTrees, setUser, user }) {
    // console.log(user)

    const [points, setPoints] = useState(0)
    const [requests, setRequests] = useState([])
    const [showRequests, setShowRequests] = useState(false)
    const [showFriends, setShowFriends] = useState(false)

    useEffect(() => {
      setRequests(user.requests)
    }, [user])

    function handleClick() {
      localStorage.removeItem("jwt");
      setUser(null);
    }

    let total = treeTypes.length
    let pts = userTrees.length

    useEffect(() => {
        setPoints(pts)
    }, [pts])

    return (
        <main className='progress'>
          <NavLink onClick={handleClick} to='/login' end className='link' style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
              Sign Out
          </NavLink>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition:{duration: .8}}} className='progress-container'>
            <div className='progress-title'>
              <h1>PROGRESS </h1>
              <span>{points} / {total}</span>
              </div>
              <hr></hr>
              <div className='progree-card-container'>
                {treeTypes.map(tree => {
                  if (tree['common_name']) {
                    return (
                      <TreeType key={tree['common_name']} tree={tree} userTrees={userTrees} userId={user.id}/>
                    )
                  }  
                })}
              </div>
          </motion.div>
          <button onClick={() => setShowRequests(!showRequests)}>show friend requests</button>
          { showRequests ? (
            <FriendRequests user={user} requests={requests} setRequests={setRequests}/>
          ) : null }
          <button onClick={() => setShowFriends(!showFriends)}>friends</button>
          { showFriends ? (
            <Friends user={user}/>
          ) : null }
        </main>
      )
}
