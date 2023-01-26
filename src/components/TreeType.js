import React, {useEffect, useState} from 'react'

export default function TreeType({tree, trees, userTreesArray}) {
    let collected = false
    const [wikiImage, setWikiImage] = useState('')
    const [treeToUse, setTreeToUse] = useState(tree)

    useEffect(()=> {
        if (tree['spc_common']==='tulip-poplar') {
            setTreeToUse({spc_common: 'tulip poplar'})
        }
    }, [])


    // console.log(tree)
    const wiki = require('wikipedia');

    (async () => {
      try {
        const page = await wiki.page(treeToUse['spc_common']);
        const summary = await page.summary();

        // console.log(tree['spc_common'], tree['spc_common']==="tulip-poplar")


        if (treeToUse['spc_common']==="black oak") {
          setWikiImage('https://upload.wikimedia.org/wikipedia/commons/e/e1/Quercus_velutina_001.jpg')
        } else if (treeToUse['spc_common']==="white oak") {
            // console.log('white oak')
            setWikiImage('https://upload.wikimedia.org/wikipedia/commons/e/e6/Keeler_Oak_Tree_-_distance_photo%2C_May_2013.jpg')
        } else if (treeToUse['spc_common']==="tulip-poplar") {
            setWikiImage('../images/tulip.jpg')
        } else {
            console.log(!!summary.thumbnail.source)
            if (!!summary.thumbnail.source) {
                setWikiImage(summary.thumbnail.source)
            }
        }
        
      } catch (error) {
        console.log(error);
      }
    })();
    
    let length = trees.filter(t => t['spc_common']===treeToUse['spc_common']).length

    let howRare;

    if (length === 1) {
        howRare = 'very rare'
    } else if (length <= 5) {
        howRare = 'rare'
    } else if (length <= 25) {
        howRare = 'uncommon'
    } else if (length <= 70) {
        howRare = 'common'
    } else {
        howRare = 'very common'
    }
    
    // console.log(userTreesArray.indexOf(tree['spc_common']))
    if (treeToUse['spc_common'] && userTreesArray.indexOf(treeToUse['spc_common'].toLowerCase()) > -1) {
        collected = true
    }

    return (
        <div className='progress-card'>
            <div className='card-image-container'>
                <img src={wikiImage} alt='image' />
            </div>
            <h3>
                {treeToUse['spc_common'].toLowerCase()}
            </h3>
            <hr></hr>
            <h4>
                {collected ? 'Successfully identified' : 'Not yet identified'}
            </h4>
            <div className="bottom">
                <span>{howRare}</span>
                {collected ? <i class='bx bxs-check-circle'></i> : <span className='circle'></span>}
            </div>
            
        </div>
      )
}
