import React, {useEffect, useState} from 'react'

export default function TreeType({tree, userTrees, userId}) {
    let collected = false 
    
    console.log(tree)
    if (tree.collected == 't') {
        collected = true
    }

    return (
        <div className='progress-card'>
            <div className='card-image-container'>
                <img src={tree.image} alt='image' />
            </div>
            <h3>
                {tree['common_name'].toLowerCase()}
            </h3>
            <hr></hr>
            <h4>
                {collected ? 'Successfully identified' : 'Not yet identified'}
            </h4>
            <div className="bottom">
                <span>{tree.frequency}</span>
                {collected ? <i class='bx bxs-check-circle'></i> : <span className='circle'></span>}
            </div>
            
        </div>
      )
}
