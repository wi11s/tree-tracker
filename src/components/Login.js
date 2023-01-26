import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 


export default function Login({setUser}) {
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
            setUser(data);
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
            setUser(data);
            navigate('/')
          } else {
            alert(data.errors)
          }
        })
      }

  return (
    <div>
        {showSignup ? (
            <div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label>email</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="submit" value="Login" />
                </form>
                <button onClick={() => setShowSignup(false)}>Sign Up</button>
            </div>
        ) : (
            <div>
                <h1>Sign Up</h1>
                <form onSubmit={handleSignupSubmit}>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <label>Email</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label>Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label>Password Confirmation</label>
                    <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                    <input type="submit" value="Sign Up" />
                </form>
                <button onClick={() => setShowSignup(true)}>Login</button>
            </div>
        )}
        
    </div>
  )
}
