import React, {useState} from 'react'
import { motion } from 'framer-motion';


export default function AddTree({handleSubmit, encodeImageFileAsURL, handleNameChange, useCustomLocation, setUseCustomLocation, handleLatChange, handleLngChange, pos }) {

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
        <div className="or">or</div>
        <div className="upload-img">
            <span className="sub-head">Use Species Name</span>
            <input className='inputStyle' type='text' placeholder='Enter Species' onChange={(e) => handleNameChange(e)}/>
        </div>

        {pos.lat ? (
          <div className='submitBtn'>
            <input type="submit" value='Submit'/>
          </div>
        ) : null}
        
      </div>
    </form>
  </motion.div>
</main>
)
}