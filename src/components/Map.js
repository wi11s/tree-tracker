import React, { useState, useEffect, useRef, ReactElement } from "react";
import {useJsApiLoader, GoogleMap, Marker} from "@react-google-maps/api"
import TreeInfo from "./TreeInfo";
import { useInRouterContext } from "react-router-dom";
import { motion } from 'framer-motion'


export default function Map({center, zoom, showTreeInfo, setShowTreeInfo, treeInfo, setTreeInfo, treeOptions, trees}) {

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY
  })

  const [userTrees, setUserTrees] = useState([])
  
  useEffect(() => {
    fetch('https://trusted-swanky-whimsey.glitch.me/trees')
    .then((res) => res.json())
    .then(obj => {
      // console.log(obj.length)
      setUserTrees(obj)
    })
  }, [setUserTrees])
  
  const [opens, setOpens] = useState(0)
  const [treeId, setTreeId] = useState(0)

  function handleClick(tree) {
    // console.log(treeId, tree['tree_id'], tree['tree_id'] === treeId, opens===0)

    if (treeId === tree['tree_id']) {
      setShowTreeInfo(!showTreeInfo)
    } else if (opens===0) {
      setShowTreeInfo(true)
    } else if (treeId !== tree['tree_id']) {
      setShowTreeInfo(true)
    }

  
    setOpens(1)
    setTreeId(tree['tree_id'])
    
    
    setTreeInfo({spc_common: tree['spc_common'], health: tree.health, tree: tree, userAdded: false})
  }

  function handleUserTreeClick(tree) {

    if (treeId === tree['id']) {
      console.log(tree)
      setShowTreeInfo(!showTreeInfo)
    } else if (opens===0) {
      setShowTreeInfo(true)
    } else if (treeId !== tree['tree_id']) {
      setShowTreeInfo(true)
    }

    setOpens(1)
    setTreeId(tree['id'])
    
    
    setTreeInfo({spc_common: tree['spc_common'], wiki: tree.wiki, image: tree.image, userAdded: true, id: tree.id})
  }

  const userTreeOptions = userTrees.filter((item, index) => index === userTrees.indexOf(userTrees.find(tree => tree['spc_common'] === item['spc_common'])))
  // console.log(userTreeOptions)

  const [filterBy, setFilterBy] = useState('')

  let displayTrees = trees.filter((tree) => {
    // console.log(tree['spc_common'].toLowerCase().includes('honeylocust'))
    return (tree['spc_common'].toLowerCase().includes(filterBy.toLowerCase()))
  })
  // console.log(displayTrees)
  // console.log(trees.filter(tree => tree['spc_common'].toLowerCase().includes('g')))

  function handleOriginalSelectChange(e) {
    console.log(e.target.value)

    if (e.target.value === 'all') {
      setFilterBy('')
    } else {
      setFilterBy(e.target.value)
    }

  }

  const [userFilterBy, setUserFilterBy] = useState('')

  let userDisplayTrees = userTrees.filter((tree) => {
    console.log(tree['spc_common'])
    if (tree['spc_common']) {
      return (tree['spc_common'].toLowerCase().includes(userFilterBy.toLowerCase()))
    }
  })
  
  function handleUserSelectChange(e) {
    console.log(e.target.value)
    if (e.target.value === 'all') {
      setUserFilterBy('')
    } else {
      setUserFilterBy(e.target.value)
    }
  }

  function handleDelete(id) {
    fetch(`https://trusted-swanky-whimsey.glitch.me/trees/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => {
      setShowTreeInfo(false)
      setUserTrees(userTrees.filter(t => t.id !== id))
    }) 
  }

  if (!isLoaded) {
    return <p>loading</p>
  }
  return (
    <main className="map">
      <motion.div className='container' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition:{duration: .8}}}>
        <h1>EXPLORE MAP</h1>
        <div className="select-container">
          <label>Filter Original Trees</label>
          <select onChange={handleOriginalSelectChange} type='select'>
            <option value='all'>ALL</option>
            <option value='none'>NONE</option>
            {treeOptions.map(tree => {
              if (tree['spc_common']) {
              return (<option value={tree['spc_common']} key={tree['spc_common']}>{tree['spc_common'].toLowerCase()}</option>)
              }
            })}
          </select>
          <label>Filter Your Trees</label>
          <select onChange={handleUserSelectChange} type='select'>
            <option value='all'>ALL</option>
            <option value='none'>NONE</option>
            {userTreeOptions.map(tree => {
              if (tree['spc_common']) {
                return (<option value={tree['spc_common']} key={tree['spc_common']}>{tree['spc_common'].toLowerCase()}</option>)
              }
            })}
          </select>
        </div>
        <div className="feature">
          <div className={`map-container ${showTreeInfo ? '' : 'map-container-full'}`}>
          <GoogleMap center={center} zoom={zoom} mapContainerStyle={{ width: '100%', height: '100%'}}>
              {displayTrees.map(tree => {           
                if (tree['spc_common']) {
                  return (
                    <Marker onClick={() => handleClick(tree)} key={tree["tree_id"]} position={{ lat:parseFloat(tree.latitude), lng:parseFloat(tree.longitude)}} icon={{url:'https://cdn.glitch.global/9f685967-c8a4-42aa-8c04-dcb09837b5fd/tree-icon%20(1).png?v=1665071872635'}}/>
                  )
                }
              })}
              {userDisplayTrees.map(tree => {
                return (
                  <Marker onClick={() => handleUserTreeClick(tree)} key={tree.id} position={{ lat:parseFloat(tree.position.lat), lng:parseFloat(tree.position.lng)}} icon={{url:'https://i.imgur.com/6WzuSjd.png'}}/>
                )
              })}
            </GoogleMap>
          </div>
          <div className={`card ${showTreeInfo ? '' : 'card-none'}`}>
            {showTreeInfo ? <TreeInfo info={treeInfo} handleClick={handleDelete}/> : null} 
          </div>
        </div>
        
        
      </motion.div>
    </main>

  )
}


 