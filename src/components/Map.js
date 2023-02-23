import React, { useState, useEffect, useRef, ReactElement } from "react";
import {useJsApiLoader, GoogleMap, Marker} from "@react-google-maps/api"
import TreeInfo from "./TreeInfo";
import { useInRouterContext } from "react-router-dom";
import { motion } from 'framer-motion';
import LoadingScreen from "./LoadingScreen";

import { useSelector, useDispatch } from 'react-redux'
import { set as setPosition, selectPosition } from '../slices/positionSlice'
import { set as setInfo, setShowInfo, selectInfo } from '../slices/infoSlice'
import { set as setUserTrees, selectUserTrees } from '../slices/userTreesSlice'

export default function Map({ treeTypes, trees }) {
  const pos = useSelector(selectPosition)
  const userPosition = pos.userPosition
  const center = pos.center
  const zoom = pos.zoom

  const info = useSelector(selectInfo)
  // console.log(info)
  const showInfo = info.showInfo
  const userTrees = useSelector(selectUserTrees).userTrees

  const dispatch = useDispatch()

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY 
  })
  
  const [opens, setOpens] = useState(0)
  const [treeId, setTreeId] = useState(0)

  function handleClick(tree) {

    if (treeId === tree['tree_id']) {
      dispatch(setShowInfo(!showInfo))
      // setShowTreeInfo(!showTreeInfo)
    } else if (opens===0) {
      dispatch(setShowInfo(true))
      // setShowTreeInfo(true)
    } else if (treeId !== tree['tree_id']) {
      dispatch(setShowInfo(true))
      // setShowTreeInfo(true)
    }

    setOpens(1)
    setTreeId(tree['tree_id'])
    
    dispatch(setInfo({id: tree.id, spc_common: tree['spc_common'], health: tree.health, tree: tree, userAdded: false}))
  }

  function handleUserTreeClick(tree) {
    // console.log(tree)

    if (treeId === tree['id']) {
      console.log(tree)
      dispatch(setShowInfo(!showInfo))
    } else if (opens===0) {
      dispatch(setShowInfo(true))
    } else if (treeId !== tree['tree_id']) {
      dispatch(setShowInfo(true))
    }

    setOpens(1)
    setTreeId(tree['id'])
    
    
    dispatch(setInfo({id: tree.id, pet_name: tree['pet_name'], spc_common: tree['common_name'], wiki: tree.wiki, image: tree.image, userAdded: true, id: tree.id}))
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
    .then((obj) => {
      dispatch(setShowInfo(false))
      dispatch(setUserTrees(userTrees.filter(t => {
        console.log(t.id)
        return t.id !== id
      })))
    })
  }

  if (!isLoaded) {
    return <LoadingScreen />
  }

  return (
    <main className="map">
      <motion.div initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0}} 
                  transition={{ duration: .3, delay: 0 }} 
                  viewport={{ once: true }}
                  className='container'>
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
          {userPosition.lat ? null : (            
            <div className="loading-content">
              <i className='bx bxs-tree'></i>
              <div className="bouncing-text">
                  <div className="L">L</div>
                  <div className="o">o</div>
                  <div className="a">a</div>
                  <div className="d">d</div>
                  <div className="i">i</div>
                  <div className="n">n</div>
                  <div className="g">g</div>
                  <div className="space"> </div>
                  <div className="l">l</div>
                  <div className="o2">o</div>
                  <div className="c">c</div>
                  <div className="a2">a</div>
                  <div className="t">t</div>
                  <div className="i2">i</div>
                  <div className="o3">o</div>
                  <div className="n2">n</div>
                  <div className="dot1">.</div>
                  <div className="dot2">.</div>
                  <div className="dot3">.</div>
              </div>
            </div>
          )}
        </div>
        <div className="feature">
          <div className={`map-container ${showInfo ? '' : 'map-container-full'}`}>
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
              <Marker position={{ lat:userPosition.lat, lng:userPosition.lng }}/>
            </GoogleMap>
          </div>
          <div className={`card ${showInfo ? '' : 'card-none'}`}>
            {showInfo ? <TreeInfo info={info} handleClick={() => handleDelete(info.id)} treeTypes={treeTypes}/> : null} 
          </div>
        </div>
        
        
      </motion.div>
    </main>
  )
}


 