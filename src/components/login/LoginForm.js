import { React, useState} from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { set } from '../../slices/userSlice';
import { motion } from "framer-motion";

export default function LoginForm({setShowSignup, setIslogin, loginRef}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [oldUser, setOldUser] = useState({
        email: '',
        password: '',
    });

    function handleOldUser(e) {
        const name = e.target.name;
        let value = e.target.value;

        setOldUser({
            ...oldUser,
            [name]: value,
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        fetch('https://tree-tracker-backend.herokuapp.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(oldUser)
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
                <p>LOGIN</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='login-input-contaienr'>
                    <input type="text" name='email' onChange={handleOldUser} placeholder='Email'/>
                    <input type="password" name='password' onChange={handleOldUser} placeholder='Password'/>

                    <div className='login-submit-btn'>
                        <button type="submit"> Login </button>
                    </div>
                </div>
            </form>

            <div className="login-switch">
                <p>Don't have an account?</p>
                <button onClick={() => setShowSignup(true)}>Sign Up</button>
            </div>
            
        </motion.div>
    )
}