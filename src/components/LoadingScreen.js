import React from "react";

export default function LoadingScreen() {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <i className='bx bxs-tree'></i>
                <div className="bouncing-text">
                    <div className="L">L</div>
                    <div className="o">o</div>
                    <div className="a">a</div>
                    <div className="d">d</div>
                    <div className="i">i</div>
                    <div className="n">n</div>
                    <div className="g">g</div>
                    <div className="dot1">.</div>
                    <div className="dot2">.</div>
                    <div className="dot3">.</div>
                </div>
            </div>
        </div>
    )
}