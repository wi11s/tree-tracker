import React, {useState} from 'react'
import AddTreeForm from './AddTreeForm';
import { motion } from 'framer-motion';


export default function AddTree({handleSubmit, encodeImageFileAsURL, handleNameChange, useCustomLocation, setUseCustomLocation, handleLatChange, handleLngChange }) {

  return (

      <>
        <AddTreeForm handleSubmit={handleSubmit} encodeImageFileAsURL={encodeImageFileAsURL} handleNameChange={handleNameChange} useCustomLocation={useCustomLocation} setUseCustomLocation={setUseCustomLocation} handleLatChange={handleLatChange} handleLngChange={handleLngChange}/>
      </>

  )
}