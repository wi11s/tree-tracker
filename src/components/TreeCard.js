import React from "react";

export default function TreeCard({tree, rarity}) {
    // console.log(tree)

    let collected = false 

    if (tree.collected == 't') {
        collected = true
    }

    function capitalizeFirstLetter(str) {
        const strArr = str.split(' ');

        for (var i = 0; i < strArr.length; i++) {
            strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
        }

        return strArr.join(' ');
    }

    return (
        <div className="tree-card">
            <div className="tree-card-image-container">
                <img src={tree.image} alt="tree" />
            </div>

            <div className="tree-card-name">
                <p>{capitalizeFirstLetter(tree['common_name'])}</p>
            </div>

            <div className="tree-card-bottom">
                <div className="tree-card-rarity" style={{backgroundColor: `${rarity[tree.frequency.replace(/ +/g, "")].color}`}}>
                    <p>{capitalizeFirstLetter(tree.frequency)}</p>
                </div>
                {collected ? <i className='bx bxs-check-circle'></i> : <span className='empty-circle'></span>}
            </div>
        </div>
    )
}