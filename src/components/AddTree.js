import React, {useState} from 'react'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { set as setPosition, selectPosition } from '../slices/positionSlice'
import { set as setInfo, setShowInfo, selectInfo } from '../slices/infoSlice'
import { set as setUserTrees, selectUserTrees } from '../slices/userTreesSlice'

export default function AddTree({ user, treeTypes }) {
  const navigate = useNavigate()

  const pos = useSelector(selectPosition)
  const userPosition = pos.userPosition
  const info = useSelector(selectInfo)
  const userTrees = useSelector(selectUserTrees).userTrees
  const dispatch = useDispatch()

  const apiKey = process.env.REACT_APP_PLANT_KEY

  const [allCommonNames, setAllCommonNames] = useState([])
  const [useCustomLocation, setUseCustomLocation] = useState(true)
  const [uploaded, setUploaded] = useState(false)
  const [petName, setPetName] = useState('')
  const [newTree, setNewTree] = useState({})


  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  function handleCheckBox() {
    setUseCustomLocation(!useCustomLocation)
  }

  function handleLatChange(e) {
    setLatitude(e.target.value)
  }
  function handleLngChange(e) {
    setLongitude(e.target.value)
  }

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
      console.log(petName)

      setNewTree({
        common_name: data.suggestions[0]['plant_details']['common_names'][0],
        scientific_name: data.suggestions[0]['plant_details']['scientific_name'],
        wiki: data.suggestions[0]['plant_details'].url,
        image: data.images[0].url,
        lat: userPosition.lat,
        lng: userPosition.lng,
        health: '',
        description: '',
        user_id: user.id
      })

      dispatch(setShowInfo(true))
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
        idPost(reader.result.slice(23))
        // console.log(reader.result.slice(23), pos)
    }
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log(petName)

    if (newTree['common_name']) {    
      fetch('user_trees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        body: JSON.stringify({pet_name: petName, ...newTree})
      })
      .then(response => response.json())
      .then((obj) => {
        console.log(obj)
        if (obj.error) {
          alert(obj.error)
        } else {
          dispatch(setInfo({
            id: obj.id, 
            pet_name: obj.pet_name, 
            spc_common: obj.common_name, 
            wiki: obj.wiki, 
            image: obj.image, 
            userAdded: true
          }))

          console.log(info)

          let newUserTrees = [...userTrees, obj]
          console.log('HERERERE', newUserTrees)
          dispatch(setUserTrees(newUserTrees))

          navigate('/map')  

          return obj
        }
      })
      .then((obj) => {
        console.log(obj)
        // if any of the names in allCommonNames is included in any of the names in userTrees, create association for progress
        let allCommonNamesString = allCommonNames.join()

        for (let x = 0; x < treeTypes.length; x++) {
          // console.log(allCommonNamesString.toLowerCase(), treeTypes[x]['common_name'].toLowerCase())

          if (allCommonNamesString.toLowerCase().replace(/\s+/g, '').includes(treeTypes[x]['common_name'].toLowerCase().replace(/\s+/g, ''))) {
            // console.log(treeTypes[x].id, 'about to post jointype')
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
      alert('Sorry but we haven\'t found your tree yet, please try again.')
    }
  }

  return (
  <main className='add-tree'>
    <motion.div className='form-container' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition:{duration: .8}}}>
      <div className='title'>ADD TREE</div>
      <hr></hr>
      <form onSubmit={e => handleSubmit(e, useCustomLocation)}>
        <div className="details">
          <div className="input-box">
            <div className="check-box">
              <span className='sub-head'>Use Current Location</span>
              <input type='checkbox' onChange={handleCheckBox} checked={useCustomLocation}/>
            </div>
            {useCustomLocation ? 
            null :
            <>
            <input type='text' className='inputStyle' placeholder='Latitude' onChange={handleLatChange}/>
            <input type='text' className='inputStyle' placeholder='Longitude' onChange={handleLngChange}/>
            </>}
          </div>

          <div className="upload-img">
            <span className='sub-head'>Upload Image</span>
            <input type='file' onChange={(e) => encodeImageFileAsURL(e)}/>
          </div>

          <div className="upload-img">
              <span className="sub-head">Add Nickname</span>
              <input className='inputStyle' type='text' placeholder='Enter Nickname' onChange={(e) => {
                console.log(e.target.value)
                setPetName(e.target.value)
              }}/>
          </div>

          {uploaded ? (
            userPosition.lat ? (
              <div className='submitBtn'>
                <input type="submit" value='Submit'/>
              </div>
            ) : <h3>Please Wait...</h3>
          ) : <h3>Please Upload Image</h3>}         
        </div>
      </form>
    </motion.div>
  </main>
  )
}