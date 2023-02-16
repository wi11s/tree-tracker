
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
import { set as setPosition } from '../slices/positionSlice'
import { set as setUserTrees, selectUserTrees } from '../slices/userTreesSlice'


function App() {

  const user = useSelector(selectUser)
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

  // get user location

  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            let newPos = {
              userPosition: {
                lat: parseFloat(position.coords.latitude),
                lng: parseFloat(position.coords.longitude)
              },
              center: {
                lat: parseFloat(position.coords.latitude), 
                lng: parseFloat(position.coords.longitude)
              },
              zoom: 15
            };
            dispatch(setPosition(newPos))
          }
        )
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

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

  const userTrees = useSelector(selectUserTrees).userTrees

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
        dispatch(setUserTrees(obj['user_trees']))
        // setUserTrees(obj['user_trees'])
      })
    }
  }, [user])

  // check to see if user is logged in
  if (!user) {
    return (<div className="login"><Login/></div>);
  }

  console.log(user)

  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="map" element={<Map treeTypes={treeTypes} trees={trees} />} />
        <Route path="addtree" element={<AddTree user={user} treeTypes={treeTypes} />} />
        <Route path="profile" element={<Profile treeTypes={treeTypes} userTrees={userTrees} user={user} />} />
        <Route path="*" element={<Error />} /> 
        <Route path="login" element={<Login />} />
        <Route path="forum" element={<Forum/>} />
        <Route path="search" element={<Search />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;