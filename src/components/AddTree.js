import React, {useState} from 'react'
import { motion } from 'framer-motion';


export default function AddTree({handleSubmit, encodeImageFileAsURL, handleNameChange, useCustomLocation, setUseCustomLocation, handleLatChange, handleLngChange, pos, uploaded, setPetName }) {

  function handleCheckBox() {
    setUseCustomLocation(!useCustomLocation)
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
          pos.lat ? (
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