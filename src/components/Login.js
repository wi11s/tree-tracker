import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import { motion } from "framer-motion";

import { useDispatch } from 'react-redux'
import { set } from '../slices/userSlice'

export default function Login({setIslogin}) {
    const dispatch = useDispatch()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [showSignup, setShowSignup] = useState(false)

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault()
        fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: email, 
            password: password 
          })
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (data.user) {
            localStorage.setItem("jwt", data.token);
            console.log(data)
            dispatch(set(data))
            setIslogin(false)
            // setUser(data);
            navigate('/')
          } else {
            alert(data.message)
          }
          
        })
      }

      function handleSignupSubmit(e) {
        e.preventDefault()
        fetch('/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email, 
            username: username, 
            password: password, 
            password_confirmation: passwordConfirmation
          })
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            localStorage.setItem("jwt", data.token);
            dispatch(set(data))
            setIslogin(false)
            // setUser(data);
            navigate('/')
          } else {
            alert(data.errors)
          }
        })
      }

  return (
    <div className='login-container'>
      <i className='bx bx-x' onClick={() => setIslogin(false)}></i>
        {showSignup ? (
          <main className='add-tree login'>
            <motion.div className='form-container login-form' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition:{duration: .8}}}>
              <div className='title'>LOG IN</div>
              <hr></hr>
              <form onSubmit={handleSubmit}>
                <div className='sign-up'>
                  <h2 className='sub-head'>Email</h2>
                  <input type="text" className='inputStyle' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email'/>
                  <h2 className='sub-head'>Password</h2>
                  <input type="password" className='inputStyle' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
                  <div className='submitBtn'>
                    <input type="submit" value='Log In'/>
                  </div>
                </div>
              </form>
              <h3>Don't have an account?</h3>
              <button onClick={() => setShowSignup(false)}>Sign Up</button>
            </motion.div>
          </main>
        ) : (
          <main className='add-tree login'>
            <motion.div className='form-container login-form' initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition:{duration: .8}}}>
              <div className='title'>SIGN UP</div>
              <hr></hr>
              <form onSubmit={handleSignupSubmit}>
                <div className='sign-up'>
                  <h2 className='sub-head'>Name</h2>
                  <input type="text" className='inputStyle' value={name} onChange={(e) => setName(e.target.value)} placeholder='Name'/>
                  <h2 className='sub-head'>Email</h2>
                  <input type="text" className='inputStyle' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email'/>
                  <h2 className='sub-head'>Username</h2>
                  <input type="text" className='inputStyle' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username'/>
                  <h2 className='sub-head'>Password</h2>
                  <input type="password" className='inputStyle' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'/>
                  <h2 className='sub-head'>Confirm Password</h2>
                  <input type="password" className='inputStyle' value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder='Confirm Password'/>
                  <div className='submitBtn'>
                    <input type="submit" value='Sign Up'/>
                  </div>
                </div>
              </form>
              <h3>Already have an account?</h3>
              <button onClick={() => setShowSignup(true)}>Login</button>
            </motion.div>
          </main>
        )}
        
    </div>
  )
}
