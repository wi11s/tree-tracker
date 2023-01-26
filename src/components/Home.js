import React from 'react';
import banner from '../images/banner.png'
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

function Home() {
  
  return (
        <main className='home'>
            <motion.div className='home-container' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition:{duration: .8}}} >
                <h1>TREE TRACKER</h1>
                <img src={banner} alt='banner' />
                <p>
                We've got you started with one thousand trees (39 species). Identify these species yourself, and discover new ones; we'll let you take it from here. 
                </p>
                <NavLink to='/map' end className='button'>Explore Map</NavLink>
            </motion.div>           
        </main>
    )
}

export default Home;
