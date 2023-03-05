import React from 'react';
import banner from '../images/banner.png'
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import Footer from './Footer';

function Home({isLoggedIn, setIslogin}) {
    function handleExploreClick() {
        if (!isLoggedIn) {
            setIslogin(true)
        }
    }
  
  return (
        <main className='home'>
            <motion.div className='home-container' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition:{duration: .8}}} >
                <h1>TREE TRACKER</h1>
                <div className='home-img-container'>
                    <img src={banner} alt='banner' />
                </div>
                <p>
                We got you started with one thousand trees (39 species). Identify these species yourself, and discover new ones. You take it from here. 
                </p>
                <NavLink to={isLoggedIn ? '/map' : '/'} end className='button' onClick={handleExploreClick}>Explore Map</NavLink>
            </motion.div>     

            <Footer />      
        </main>
    )
}

export default Home;
