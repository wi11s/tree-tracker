import React, { useState, useEffect } from 'react'
import TreeType from './TreeType'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom';


export default function ({ treeOptions, trees, setUser }) {
    const [points, setPoints] = useState(0)
    const [userTreesArray, setUserTreesArray] = useState([])
    let arr = [];

    function handleClick() {
      localStorage.removeItem("jwt");
      setUser(null);
    }
  
    // useEffect(() => {
    //   fetch('https://trusted-swanky-whimsey.glitch.me/trees')
    //   .then((res) => res.json())
    //   .then(obj => {
    //     console.log(obj)
    //     obj.map(o => {
    //       if (o['spc_common']) {
    //         arr.push(o['spc_common'].toLowerCase())
    //       }
    //     })
    //     setUserTreesArray(arr)
    //     // console.log(arr)
    //   })
    // }, [setUserTreesArray])

    let total = treeOptions.length
    let pts = userTreesArray.length

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
              {treeOptions.map(tree => {
                if (tree['spc_common']) {
                  return (
                    <TreeType key={tree['spc_common']} tree={tree} trees={trees} userTreesArray={userTreesArray}/>
                  )
                }  
              })}
            </div>
        </motion.div>
        </main>
      )
}
