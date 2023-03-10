import React, { useState, useRef, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

export default function Login({setIslogin}) {
  const [showSignup, setShowSignup] = useState(false);
  let loginRef = useRef();

  useEffect(() => {
    let handler = e => {
        if(!loginRef.current.contains(e.target)) {
            setIslogin(false);
        }
    }

    document.addEventListener('mousedown', handler);

    return () => {
        document.removeEventListener('mousedown', handler);
    }
})

  return (
    <div className='login-container'>
        { showSignup ? 
        <SignUpForm setShowSignup={setShowSignup} setIslogin={setIslogin} loginRef={loginRef}/> 
        : 
        <LoginForm setShowSignup={setShowSignup} setIslogin={setIslogin} loginRef={loginRef}/> }
    </div>
  )
}
