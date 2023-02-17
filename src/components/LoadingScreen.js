import React from "react";

export default function LoadingScreen() {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <i className='bx bxs-tree'></i>
                <div class="bouncing-text">
                    <div class="L">L</div>
                    <div class="o">o</div>
                    <div class="a">a</div>
                    <div class="d">d</div>
                    <div class="i">i</div>
                    <div class="n">n</div>
                    <div class="g">g</div>
                    <div class="dot1">.</div>
                    <div class="dot2">.</div>
                    <div class="dot3">.</div>
                </div>
            </div>
        </div>
    )
}