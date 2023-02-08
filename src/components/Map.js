import React, { useState, useEffect, useRef, ReactElement } from "react";
import {useJsApiLoader, GoogleMap, Marker} from "@react-google-maps/api"
import TreeInfo from "./TreeInfo";
import { useInRouterContext } from "react-router-dom";
import { motion } from 'framer-motion'


export default function Map({center, zoom, showTreeInfo, setShowTreeInfo, treeInfo, setTreeInfo, treeTypes, trees, pos, userTrees, setUserTrees}) {
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY
  })
  
  const [opens, setOpens] = useState(0)
  const [treeId, setTreeId] = useState(0)

  function handleClick(tree) {

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
    console.log(tree)

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
    
    
    setTreeInfo({spc_common: tree['common_name'], wiki: tree.wiki, image: tree.image, userAdded: true, id: tree.id})
  }

  const userTreeOptions = userTrees.filter((item, index) => index === userTrees.indexOf(userTrees.find(tree => tree['spc_common'] === item['spc_common'])))

  const [filterBy, setFilterBy] = useState('')

  let displayTrees = trees.filter((tree) => {
    return (tree['spc_common'].toLowerCase().includes(filterBy.toLowerCase()))
  })

  function handleSelectChange(e) {
    console.log(e.target.value)

    if (e.target.value === 'all') {
      setFilterBy('')
    } else {
      setFilterBy(e.target.value)
    }

  }

  let userDisplayTrees = userTrees.filter((tree) => {
    // console.log(tree)
    if (tree['common_name']) {
      return (tree['common_name'].toLowerCase().includes(filterBy.toLowerCase()))
    }
  })

  function handleDelete(id) {
    console.log(id)
    fetch(`/user_trees/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      }
    })
    .then(res => res.json())
    .then(() => {
      setShowTreeInfo(false)
      setUserTrees(userTrees.filter(t => {
        console.log(t.id)
        return t.id !== id
      }))
    })
  }

  if (!isLoaded) {
    return <p>loading</p>
  }

  // console.log(pos)
  return (
    <main className="map">
      <motion.div className='container' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition:{duration: .8}}}>
        <h1>EXPLORE MAP</h1>
        <div className="select-container">
          <label>Filter Trees</label>
          <select onChange={handleSelectChange} type='select'>
            <option value='all'>ALL</option>
            <option value='none'>NONE</option>
            {treeTypes.map(tree => {
              if (tree['common_name']) {
                return (<option value={tree['common_name']} key={tree['common_name']}>{tree['common_name'].toLowerCase()}</option>)
              }
            })}
            {userTreeOptions.map(tree => {
              // console.log(tree['common_name'])
              if (tree['common_name']) {
                return (<option value={tree['common_name']} key={tree['common_name']}>{tree['common_name'].toLowerCase()}</option>)
              }
            })}
          </select>
          {pos.lat ? null : <label>Loading Your Location...</label>}
        </div>
        <div className="feature">
          <div className={`map-container ${showTreeInfo ? '' : 'map-container-full'}`}>
          <GoogleMap center={center} zoom={zoom} mapContainerStyle={{ width: '100%', height: '100%'}}>
              {displayTrees.map(tree => {           
                if (tree['spc_common']) {
                  return (
                    <Marker onClick={() => handleClick(tree)} key={tree["tree_id"]} position={{ lat:parseFloat(tree.latitude), lng:parseFloat(tree.longitude)}} icon={{url:'https://cdn.glitch.global/9f685967-c8a4-42aa-8c04-dcb09837b5fd/tree-icon%20(1).png?v=1665071872635'}} optimized='true'/>
                  )
                }
              })}
              {userDisplayTrees.map(tree => {
                return (
                  <Marker onClick={() => handleUserTreeClick(tree)} key={tree.id} position={{ lat:parseFloat(tree.lat), lng:parseFloat(tree.lng) }} icon={{url:'https://i.imgur.com/6WzuSjd.png'}}/>
                )
              })}
              <Marker position={{ lat:pos.lat, lng:pos.lng }}/>
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


 