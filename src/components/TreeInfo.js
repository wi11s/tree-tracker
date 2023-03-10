import { IDLE_NAVIGATION } from '@remix-run/router'
import React, {useState} from 'react'
import {motion} from 'framer-motion'

export default function TreeInfo({info, handleClick}) {
  // console.log(info.wiki)

  const imageExists = info.image !== undefined
  const [description, setDescription] = useState('');
  const [wikiLink, setWikiLink] = useState('')
  const [wikiImage, setWikiImage] = useState('')

  const wiki = require('wikipedia');

  (async () => {
    try {
      let page;
      if (info['spc_common']==="tulip-poplar") {
        page = await wiki.page('Liriodendron tulipifera');
      } else if (info['spc_common']==="ash") {
        page = await wiki.page('Fraxinus');
      } else if (info['spc_common']==="black oak") {
        page = await wiki.page('Quercus velutina');
      } else if (info.userAdded) {
        page = await wiki.page(info.wiki.slice(30));
      } else {
        page = await wiki.page(info['spc_common']);
      }
      const summary = await page.summary();
      setDescription(`${summary.extract.slice(0, 200)} . . .`)
      // console.log(summary)
      setWikiLink(summary['content_urls'].desktop.page)
      setWikiImage(summary.originalimage.source)
      
    } catch (error) {
      console.log(error);
    }
  })();
  return (
    <motion.div initial={{ scale: .98, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition:{duration: .8}}}>
        <div className='details'>{info['spc_common']}</div>
        { !!info['pet_name'] ? <h3>{info['pet_name']}</h3> : null }
        <hr></hr>
        <div className="details">
          <h4>Description</h4>
          <p>{description}</p>
          <div className='moreInfo'>
          <a href={imageExists? info.wiki : wikiLink} target="_blank" rel="noopener noreferrer">More Info</a>
          {info.userAdded ? <button onClick={() => handleClick(info.id)}>Remove</button> : null}
          </div>
        </div>

        <div className="image-container">
          <img src={imageExists ? info.image : wikiImage} alt='image'/>
        </div>
    </motion.div>
  )
}
