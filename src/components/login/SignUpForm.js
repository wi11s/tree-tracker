import { React, useState} from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { set } from '../../slices/userSlice';
import { motion } from "framer-motion";

export default function SignUpForm({setShowSignup, setIslogin, loginRef}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    function handleNewUser(e) {
        const name = e.target.name;
        let value = e.target.value;

        setNewUser({
            ...newUser,
            [name]: value,
        })
    }

    function handleSignupSubmit(e) {
        e.preventDefault()
        fetch('https://tree-tracker-backend.herokuapp.com/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
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
          <motion.div initial={{ opacity: 0, y: 10 }} 
          whileInView={{ opacity: 1, y: 0}} 
          transition={{ duration: .3, delay: 0 }} 
          viewport={{ once: true }}
          ref={loginRef}
          className='login-form'>
            {/* <div className="close-login" onClick={() => setIslogin(false)}>
                <i className='bx bx-x'></i>
            </div> */}

            <div className='login-form-title'>
                <p>SIGN UP</p>
            </div>
            <form onSubmit={handleSignupSubmit}>
              <div className='login-input-contaienr'>
                  <input type="text" name='name' onChange={handleNewUser} placeholder='Name'/>
                  <input type="text" name='email' onChange={handleNewUser} placeholder='Email'/>
                  <input type="text" name='username' onChange={handleNewUser} placeholder='Username'/>
                  <input type="password" name='password' onChange={handleNewUser} placeholder='Password'/>
                  <input type="password" name='password_confirmation' onChange={handleNewUser} placeholder='Confirm Password'/>

                  <div className='login-submit-btn'>
                    <button type="submit"> Sign Up </button>
                  </div>
              </div>
            </form>

            <div className="login-switch">
                <p>Already have an account?</p>
                <button onClick={() => setShowSignup(false)}>Login</button>
            </div>
        </motion.div>
    )
}