import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { set } from '../slices/userSlice'
import { set as setPosition, selectPosition } from '../slices/positionSlice'
import { set as setInfo, setShowInfo, selectInfo } from '../slices/infoSlice'
import { set as setUserTrees, selectUserTrees } from '../slices/userTreesSlice'
// import { set as setTreeTypes, selectTreeTypes } from '../slices/treeTypesSlice'

export default function AddTree({ user, treeTypes, setTreeTypes }) {
  const navigate = useNavigate()

  const pos = useSelector(selectPosition)
  const userPosition = pos.userPosition
  const info = useSelector(selectInfo)
  const userTrees = useSelector(selectUserTrees).userTrees
  const dispatch = useDispatch()
  const apiKey = process.env.REACT_APP_PLANT_KEY

  const [allCommonNames, setAllCommonNames] = useState([])
  const [useCustomLocation, setUseCustomLocation] = useState(false)

  const [petName, setPetName] = useState('')
  const [newTree, setNewTree] = useState({})
  const [allowSubmit, setAllowSubmit] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [fileName, setFileName] = useState('')

  function handleCheckBox() {
    setUseCustomLocation(!useCustomLocation)
  }

  // change to dispatch
  function handleLatChange(e) {
    // setLatitude(e.target.value)
  }
  function handleLngChange(e) {
    // setLongitude(e.target.value)
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
        latitude: userPosition.lat,
        longitude: userPosition.lng,
        plant_details: ["common_names", "url"],
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setAllowSubmit(true)

      if (data.suggestions[0]['plant_details']['common_names'][0] !== 'Nom cientific') {
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
      } else {
        setNewTree({
          common_name: data.suggestions[0]['plant_details']['common_names'][1],
          scientific_name: data.suggestions[0]['plant_details']['scientific_name'],
          wiki: data.suggestions[0]['plant_details'].url,
          image: data.images[0].url,
          lat: userPosition.lat,
          lng: userPosition.lng,
          health: '',
          description: '',
          user_id: user.id
        })
      }


      setAllCommonNames(data.suggestions[0]['plant_details']['common_names'])
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
    setFileName(file.name)

    // console.log('reader', reader)
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
              setTreeTypes(obj)

              const rarity = {
                verycommon: {
                    color: '#bdbbbb',
                    point: 20,
                },
                common: {
                    color: '#3bad4c',
                    point: 40,
                },
                uncommon: {
                    color: '#1cc7e6',
                    point: 60,
                },
                rare: {
                    color: '#743bad',
                    point: 80,
                },
                veryrare: {
                    color: '#e67d1c',
                    point: 100,
                }
              }
          

              console.log(treeTypes[x].frequency.replace(/\s+/g, ''))
              fetch(`/users/score/${user.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.jwt}`
                },
                body: JSON.stringify({
                  score: rarity[treeTypes[x].frequency.replace(/\s+/g, '')].point
                })
              })
              .then(response => response.json())
              .then((obj) => {
                console.log(obj)
                dispatch(set(obj))
              })
              
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
    <div className="add-tree-container">
      <form className='add-tree-form' onSubmit={e => handleSubmit(e, useCustomLocation)}>

        {/* ----------- step one ----------- */}

        <motion.div initial={{ opacity: 0, y: 10 }} 
                    whileInView={{ opacity: 1, y: 0}} 
                    transition={{ duration: .3, delay: 0 }} 
                    viewport={{ once: true }}
                    className="add-tree-island">
          <h1 className="add-tree-header">
            <p>1. Choose Location</p>
          </h1>

          <div className="add-tree-action">
            <div className="add-tree-location-indicator">
              {userPosition.lat ? <i className='bx bx-check'></i> : <i className='bx bx-loader' ></i>}
              <p>Current Location</p>
            </div>

            <div className="add-tree-custom-location" onClick={handleCheckBox}>
              <p>Custom Location</p>
            </div>

          </div>

          <div className="add-tree-check">
            {userPosition.lat ? <i className='bx bxs-check-circle' ></i> : <i className='bx bxs-check-circle' style={{opacity: ".2"}}></i>}
          </div>
        </motion.div>

        {/* ----------- custome location ----------- */}

        {useCustomLocation ? 
          <div className="custom-location-container">
          <div className="custom-input">
            <div className="custom-location">
              <p>Latitude:</p>
              <input type="text" placeholder='ex: 30.26' onChange={handleLatChange}/>
            </div>

            <div className="custom-location">
              <p>Longitude:</p>
              <input type="text" placeholder='ex: 50.33' onChange={handleLngChange}/>
            </div>
          </div>
        </div>
        :
        null
        }  

        {/* ----------- step twp ----------- */}

        <motion.div initial={{ opacity: 0, y: 10 }} 
                    whileInView={{ opacity: 1, y: 0}} 
                    transition={{ duration: .3, delay: .3 }} 
                    viewport={{ once: true }}
                    className="add-tree-island">
          <h1 className="add-tree-header">
            <p>2. Upload Image</p>
          </h1>

          <div className="add-tree-action">
            <label className="custom-file-upload">
                <input type="file" onChange={(e) => encodeImageFileAsURL(e)} />
                <i className='bx bx-plus' ></i> 
                <p>Choose File</p>    
            </label>

            <div className="add-tree-alert">
              {uploaded ? (allowSubmit ? <p>{fileName.substring(0, 20)}</p> : <p>Loading image...</p>): <p>Please Upload Image</p>}
            </div>
          </div>

            <div className="add-tree-check">
              {allowSubmit ? <i className='bx bxs-check-circle' ></i> : <i className='bx bxs-check-circle' style={{opacity: '.2'}}></i>}
            </div>
        </motion.div>

        {/* ----------- step three ----------- */}

        <motion.div initial={{ opacity: 0, y: 10 }} 
                    whileInView={{ opacity: 1, y: 0}} 
                    transition={{ duration: .3, delay: .5 }} 
                    viewport={{ once: true }}
                    className="add-tree-island">
          <h1 className="add-tree-header">
            <p>3. Name Your Tree</p>
          </h1>

          <div className="add-tree-action">
            <div className="add-tree-input">
              <input type='text' placeholder='Enter Nickname' onChange={(e) => {setPetName(e.target.value)}}/>
            </div>
          </div>

          <div className="add-tree-check">
            {petName !== "" ? <i className='bx bxs-check-circle' ></i> : <i className='bx bxs-check-circle' style={{opacity: '.2'}}></i>}
          </div>
        </motion.div>

        {/* ----------- submit button ----------- */}

        <motion.div initial={{ opacity: 0, y: 10 }} 
                    whileInView={{ opacity: 1, y: 0}} 
                    transition={{ duration: .3, delay: .9 }} 
                    viewport={{ once: true }}
                    className="add-tree-btn">
          <button type='submit'>Submit</button>
        </motion.div>

      </form>
    </div>
  )
}