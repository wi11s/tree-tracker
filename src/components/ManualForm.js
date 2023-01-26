import React, {useState} from 'react'
import { motion } from 'framer-motion'

export default function ManualForm({setIsManual, handleSubmit, pos}) {

  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [wikiImage, setWikiImage] = useState('')
  const [wikiLink, setWikiLink] = useState('')
  const [newTree, setNewTree] = useState({})



  const wiki = require('wikipedia');

  (async () => {
    try {
      const page = await wiki.page(name);
      const summary = await page.summary();
      console.log(summary)
      setWikiLink(summary['content_urls'].desktop.page)

      setWikiImage(summary.thumbnail.source)

    } catch (error) {
      console.log(error);

    }
  })();



  function handleChange(e) {
    setName(e.target.value)
    setImage()
    setNewTree({
      spc_common: name,
      wiki: wikiLink,
      image: wikiImage,
      position: pos
    })
  }

  

    return (
      <main className='add-tree'>
      <motion.div className='form-container' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition:{duration: .8}}}>
        <div className='title'>MANUAL INPUT</div>
        <hr></hr>
        <form handleSubmit={(e) => handleSubmit(e, newTree)}>
          <div className="details">
            <div className="input-box">
              <span className='sub-head'>Name</span>
              <input type='text' placeholder='Enter Tree Name' onChange={handleChange}/>
            </div>

            <div className="input-box">
              <span className='sub-head'>Wiki Link</span>
              <input type='text' placeholder='Enter Wiki Link' />
            </div>

            <div className="input-box">
              <span className='sub-head'>Lat</span>
              <input type='text' placeholder='Enter Lat' />
            </div>

            <div className="input-box">
              <span className='sub-head'>Lng</span>
              <input type='text' placeholder='Enter Lng' />
            </div>

            <div className="upload-img">
              <span className='sub-head'>Upload Image</span>
              <input type='file' />
            </div>

            <div className='submitBtn'>
              <input type="submit" value='Submit'/>
            </div>

            <div className='manual-input'>
              <button type='button' onClick={() => setIsManual(false)}>
                Go Back
              </button>
              </div>
          </div>
        </form>
      </motion.div>
    </main>
    )
  
}
