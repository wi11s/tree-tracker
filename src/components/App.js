
import './App.css';
import React, {useState, useEffect} from'react';

import {Routes, Route } from "react-router-dom"

import Home from './Home';
import Header from './Header';
import Map from './Map';
import Error from './Error';
import AddTree from './AddTree';
import Profile from './Profile';
import Login from './login/Login';
import Feed from './forum/Feed.js';
import Search from './Search';
import FriendList from './FriendList';

import { useSelector, useDispatch } from 'react-redux'
import { set, selectUser } from '../slices/userSlice'
import { set as setPosition, selectPosition } from '../slices/positionSlice'
import { set as setUserTrees, selectUserTrees } from '../slices/userTreesSlice'


function App() {

  const apiKey = process.env.REACT_APP_PLANT_KEY

  useEffect(() => {
    fetch('https://api.plant.id/v2/usage_info', {
      method: 'GET',
      headers: {
        "Api-Key": apiKey
      }
    })
    .then(response => response.json())
    .then(data => {
      // console.log('Success:', data);
    })
  }, [])


  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  const pos = useSelector(selectPosition)
  const userPosition = pos.userPosition

  const [trees, setTrees] = useState([])
  const [treeTypes, setTreeTypes] = useState([])

  const [isLogin, setIslogin] = useState(false);
  const [isFriendList, setIsFriendList] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // console.log(isLoggedIn)

  // set user

  useEffect(() => {
    if (user && user.id) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [user])

  useEffect(() => {
    fetch("https://tree-tracker-backend.herokuapp.com/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      }
    })
    .then((r) => {
      // console.log(r)
      if (r.ok) {
        r.json().then((user) => {
          console.log(user)
          dispatch(set(user))
        });
      }
    });
  }, [localStorage.getItem("jwt")]);

  // get user location

  useEffect(() => {
    const timer = setTimeout(() => {
      // console.log(userPosition)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // console.log(pos)
            if (pos.isInitial) {
              let newPos = {
                userPosition: {
                  lat: parseFloat(position.coords.latitude),
                  lng: parseFloat(position.coords.longitude)
                },
                center: {
                  lat: parseFloat(position.coords.latitude), 
                  lng: parseFloat(position.coords.longitude)
                },
                zoom: 15,
                isInitial: false
              };
              dispatch(setPosition(newPos))
            } else {
              let newPos = {
                userPosition: {
                  lat: parseFloat(position.coords.latitude),
                  lng: parseFloat(position.coords.longitude)
                },
                center: pos.center,
                zoom: pos.zoom,
                isInitial: false
              };
              dispatch(setPosition(newPos))
            }
          }
        )
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [userPosition])

  // set tree types

  useEffect(() => {
    fetch(`https://tree-tracker-backend.herokuapp.com/tree_types`, {
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
      fetch(`https://tree-tracker-backend.herokuapp.com/users/${user.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        }
      })
      .then((res) => res.json())
      .then(obj => {
        console.log(obj)
        dispatch(setUserTrees(obj['user_trees']))
        // setUserTrees(obj['user_trees'])
      })
    }
  }, [user])
  // check to see if user is logged in
  // if (user.id === null) {
  //   return (<div className="login"><Login/></div>);
  // }

  // console.log(treeTypes)

  return (
    <div className="App">
      <Header user={user} setIslogin={setIslogin} isLoggedIn={isLoggedIn} setIsFriendList={setIsFriendList}/>
      {isLogin ? <Login setIslogin={setIslogin} /> : null}
      {isFriendList && user.id !== null ? <FriendList user={user} isFriendList={isFriendList} setIsFriendList={setIsFriendList}/> : null}
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIslogin={setIslogin}/>} />
        {isLoggedIn ?
        <>
          <Route path="map" element={<Map treeTypes={treeTypes} trees={trees} />} />
          <Route path="addtree" element={<AddTree user={user} treeTypes={treeTypes} setTreeTypes={setTreeTypes}/>} />
          <Route path="profile" element={<Profile treeTypes={treeTypes} userTrees={userTrees} user={user}/>} />
          <Route path="*" element={<Error />} /> 
          <Route path="login" element={<Login />} />
          <Route path="feed" element={<Feed/>} />
          <Route path="search" element={<Search user={user}/>} /> 
        </>
          :
          null
        }
        
      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;