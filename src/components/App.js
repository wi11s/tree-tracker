
import './App.css';
import React, {useState, useEffect} from'react';

import {Routes, Route } from "react-router-dom"

import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import Map from './Map';
import Error from './Error';
import AddTree from './AddTree';
import Profile from './Profile';
import Login from './Login';
import Forum from './forum/Forum.js'
import Search from './Search'

import { useSelector, useDispatch } from 'react-redux'
import { set, selectUser } from '../slices/userSlice'


function App() {
  // console.log('start')

  const user = useSelector(selectUser)
  console.log('redux:', user)
  const dispatch = useDispatch()

  const [trees, setTrees] = useState([])
  const [treeTypes, setTreeTypes] = useState([])

  // set user

  useEffect(() => {
    fetch("/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      }
    })
    .then((r) => {
      // console.log(r)
      if (r.ok) {
        r.json().then((user) => {
          // console.log(user)
          dispatch(set(user))
        });
      }
    });
  }, [localStorage.getItem("jwt")]);

  // set tree types

  useEffect(() => {
    fetch(`/tree_types`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
      }
    })
    .then((res) => res.json())
    .then(obj => {
      // console.log(obj)
      setTreeTypes(obj)
    })
  }, [user])

  // set trees from census data

  useEffect(() => {
    fetch('https://data.cityofnewyork.us/resource/5rq2-4hqu.json')
    .then((res) => res.json())
    .then(obj => {
      setTrees(obj.filter(t => t['spc_common'] !== undefined))
    })
  }, [])

  // set trees from user data

  const [userTrees, setUserTrees] = useState([])
  
  useEffect(() => {
    if (user && user.id) {
      fetch(`/users/${user.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      })
      .then((res) => res.json())
      .then(obj => {
        // console.log(obj['tree_types'])
        setUserTrees(obj['user_trees'])
      })
    }
  }, [user])

  // set states

  const [showTreeInfo, setShowTreeInfo] = useState(false)
  const [treeInfo, setTreeInfo] = useState({spc_common: '', userAdded: true})

  const [allTrees, setAllTrees] = useState([])

  useEffect(() => {
    setAllTrees([...trees, ...userTrees])
    // console.log([...trees, ...userTrees])
  }, [trees, userTrees])

  // check to see if user is logged in
  if (!user) {
    return (<div className="login"><Login/></div>);
  }

  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="map" element={<Map showTreeInfo={showTreeInfo} setShowTreeInfo={setShowTreeInfo} treeInfo={treeInfo} setTreeInfo={setTreeInfo} treeTypes={treeTypes} trees={trees} userTrees={userTrees} setUserTrees={setUserTrees}/>} />
        <Route path="addtree" element={<AddTree user={user}/>} />
        <Route path="profile" element={<Profile treeTypes={treeTypes} userTrees={userTrees} user={user}/>} />
        <Route path="*" element={<Error />} /> 
        <Route path="login" element={<Login />} />
        <Route path="forum" element={<Forum/>} />
        <Route path="search" element={<Search />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;