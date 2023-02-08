
import './App.css';
import React, {useState, useEffect} from'react';

import {Routes, Route } from "react-router-dom"
// import { BrowserRouter as Router } from 'react-router-dom';
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
import { useNavigate } from 'react-router-dom'
import { isCompositeComponent } from 'react-dom/test-utils';


function App() {
  // console.log('start')

  const [user, setUser] = useState(null)
  const [useCustomLocation, setUseCustomLocation] = useState(true)
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

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
        r.json().then((user) => setUser(user));
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
    if (user) {
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

  function handleLatChange(e) {
    setLatitude(e.target.value)
  }
  function handleLngChange(e) {
    setLongitude(e.target.value)
  }

  // get user location

  const [pos, setPos] = useState({lat: 0, lng: 0})
  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (useCustomLocation) {
              let newPos = {
                lat: parseFloat(position.coords.latitude),
                lng: parseFloat(position.coords.longitude)
              };
              setPos(newPos)

            } else {
              pos = {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude)
              }
              setCenter(pos)
              setZoom(15)
            }
          }
        )
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // set states

  const navigate = useNavigate()
  const apiKey = process.env.REACT_APP_PLANT_KEY

  const [showTreeInfo, setShowTreeInfo] = useState(false)
  const [treeInfo, setTreeInfo] = useState({spc_common: '', userAdded: true})
  const [newTree, setNewTree] = useState({})
  const [petName, setPetName] = useState('')
  const [uploaded, setUploaded] = useState(false)
  const [allCommonNames, setAllCommonNames] = useState([])

  const [center, setCenter] = useState({ lat: 40.74, lng: -73.90 })
  const [zoom, setZoom] = useState(12)

  const [allTrees, setAllTrees] = useState([])

  useEffect(() => {
    setAllTrees([...trees, ...userTrees])
    // console.log([...trees, ...userTrees])
  }, [trees, userTrees])

  // get tree info from census data  
  function idPost(base64files) {
    fetch('https://api.plant.id/v2/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Api-Key": apiKey
      },
      body: JSON.stringify({
        images: [base64files],
        modifiers: ["similar_images"],
        plant_details: ["common_names", "url"],
        }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data.suggestions[0]['plant_details']['common_names']);
      setAllCommonNames(data.suggestions[0]['plant_details']['common_names'])
      console.log(petName)
      setNewTree({
        pet_name: petName,
        common_name: data.suggestions[0]['plant_details']['common_names'][0],
        scientific_name: data.suggestions[0]['plant_details']['scientific_name'],
        wiki: data.suggestions[0]['plant_details'].url,
        image: data.images[0].url,
        lat: pos.lat,
        lng: pos.lng,
        health: '',
        description: '',
        user_id: user.id
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  function encodeImageFileAsURL(e) {
    setUploaded(true)
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = function() {
        idPost(reader.result.slice(23), pos)
        console.log(reader.result.slice(23), pos)
    }
    reader.readAsDataURL(file);
  }
  
  // new tree post
  function handleSubmit(e) {
    e.preventDefault()
    if (pos===undefined) {
      alert('please wait for your current location to load')
    } else if (newTree['common_name'])/*if (name==='')*/ {
      console.log(newTree)
    
      fetch('user_trees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify(newTree)
      })
      .then(response => response.json())
      .then((obj) => {
        // console.log(obj)
        if (obj.error) {
          alert(obj.error)
        } else {
          navigate('/map')
          setCenter(pos)
          setZoom(16)
          setTreeInfo({spc_common: obj['common_name'], wiki: obj.wiki, image: obj.image, userAdded: true})
  
          setAllTrees(allTrees => [...allTrees, obj])
          let newUserTrees = [...userTrees, obj]
          setUserTrees(newUserTrees)
    
          setShowTreeInfo(true)
          return obj
        }
      })
      .then((obj) => {
        console.log(obj.id)
        // if any of the names in allCommonNames is included in any of the names in userTrees, create association for progress
        let allCommonNamesString = allCommonNames.join()

        for (let x = 0; x < treeTypes.length; x++) {
          console.log(allCommonNamesString.toLowerCase(), treeTypes[x]['common_name'].toLowerCase())

          if (allCommonNamesString.toLowerCase().replace(/\s+/g, '').includes(treeTypes[x]['common_name'].toLowerCase().replace(/\s+/g, ''))) {
            console.log(treeTypes[x].id, 'about to post jointype')
            fetch('/join_types', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("jwt")}`
              },
              body: JSON.stringify({
                user_id: user.id,
                tree_type_id: treeTypes[x].id,
                user_tree_id: obj.id
              })
            })
            .then(response => response.json())
            .then((obj) => {
              console.log(obj)
            })
            break
          }
        }
      })

    } else {
      alert('Sorry but we couldn\'t find tree, please try again.')
    }
  }

  // console.log(user)
  // useEffect(() => {
  //   fetch('/join_types', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem("jwt")}`
  //     },
  //     body: JSON.stringify({
  //       user_id: 4,
  //       tree_type_id: 241,
  //       user_tree_id: 12
  //     })
  //   })
  // }, [])

  // check to see if user is logged in
  if (!user) {
    return (<div className="login"><Login setUser={setUser} /></div>);
  }

  return (
    <div className="App">
      <Header setUser={setUser}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="map" element={<Map center={center} zoom={zoom} showTreeInfo={showTreeInfo} setShowTreeInfo={setShowTreeInfo} treeInfo={treeInfo} setTreeInfo={setTreeInfo} treeTypes={treeTypes} trees={trees} pos={pos} userTrees={userTrees} setUserTrees={setUserTrees}/>} />
        <Route path="addtree" element={<AddTree handleSubmit={handleSubmit} encodeImageFileAsURL={encodeImageFileAsURL} /*handleNameChange={handleNameChange}*/ setUseCustomLocation={setUseCustomLocation} handleLatChange={handleLatChange} handleLngChange={handleLngChange} useCustomLocation={useCustomLocation} pos={pos} uploaded={uploaded} setPetName={setPetName}/>} />
        <Route path="profile" element={<Profile treeTypes={treeTypes} userTrees={userTrees} setUser={setUser} user={user}/>} />
        <Route path="*" element={<Error />} /> 
        <Route path="login" element={<Login setUser={setUser} />} />
        <Route path="forum" element={<Forum user={user}/>} />
        <Route path="search" element={<Search />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;