import React from 'react';
import logo from '../images/logo.png'
import { NavLink } from 'react-router-dom';

function Header() {
    return(
        <header className='header'>
            <nav className='nav'>
                <NavLink to='/' end><img src={logo} alt='logo' /></NavLink>              
                <ul className='menu'>
                    <li>
                        <NavLink to='/' end className='link' style={({ isActive }) => ({borderBottom: isActive? '1.5px solid #3d4637' : null, paddingBottom: isActive ? "5px" : null})}>
                        Home
                        </NavLink>
                    </li>
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
                        Progress
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;