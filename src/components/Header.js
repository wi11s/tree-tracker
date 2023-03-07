import React, { useState } from 'react';
import logo from '../images/logo.png'
import { NavLink } from 'react-router-dom';

function Header({user, setIslogin, isLoggedIn, setIsFriendList }) {
    const [isMenu, setIsMenu] = useState(false);

    function handleFriendClick() {
        setIsFriendList(true);
        setIsMenu(false);
    }

    return(
        <header className='header'>
            <nav className='nav'>
                <NavLink to='/' end><img src={logo} alt='logo' /></NavLink> 
                {isLoggedIn ?
                <>
                    <i className='bx bx-menu' onClick={() => setIsMenu(true)}></i>
                    <ul className={`menu ${isMenu ? 'toggle-menu' : null}`}>
                        <i className='bx bx-x' onClick={() => setIsMenu(false)}></i>
                        <li>
                            <NavLink to='/' end className='link' onClick={() => setIsMenu(false)} style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                            Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/map' end className='link' onClick={() => setIsMenu(false)} style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                            Map
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/addtree' end className='link' onClick={() => setIsMenu(false)} style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                            Add Tree
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/profile' end className='link' onClick={() => setIsMenu(false)} style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                            Profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/feed' end className='link' onClick={() => setIsMenu(false)} style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                            Feed
                            </NavLink>
                        </li>
                        <li>
                            <div className='link' onClick={handleFriendClick}>
                            Friends
                            </div>
                        </li>
                    </ul>
                </>
                : 
                <ul className='menu-sub'>
                    <li>
                        <div className='link' onClick={() => setIslogin(true)}>
                            Login / Sign Up
                        </div>
                    </li>
                </ul>
                }             
                
            </nav>
        </header>
    )
}

export default Header;