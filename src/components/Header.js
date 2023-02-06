import React from 'react';
import logo from '../images/logo.png'
import { NavLink } from 'react-router-dom';

function Header({setUser}) {
    function handleClick() {
        localStorage.removeItem("jwt");
        setUser(null);
      }
    return(
        <header className='header'>
            <nav className='nav'>
                <NavLink to='/' end><img src={logo} alt='logo' /></NavLink>              
                <ul className='menu'>
                    {/* <li>
                        <NavLink to='/' end className='link' style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                        Home
                        </NavLink>
                    </li> */}
                    <li>
                        <NavLink to='/map' end className='link' style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                        Map
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/addtree' end className='link' style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                        Add Tree
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/progress' end className='link' style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                        Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/forum' end className='link' style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                        Forum
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/search' end className='link' style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                        Search
                        </NavLink>
                    </li>
                    {/* <li onClick={handleClick}>
                        <NavLink to='/login' end className='link' style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                        Sign Out
                        </NavLink>
                    </li> */}
                </ul>
            </nav>
        </header>
    )
}

export default Header;