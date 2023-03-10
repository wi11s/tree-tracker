import React, {useState, useEffect } from 'react'
import UserCard from './UserCard'

export default function Search({user}) {
  const [users, setUsers] = useState([])
  const [displayUsers, setDisplayUsers] = useState([{}])

  useEffect(() => {
    if (user.id !== null) {
      fetch(`https://tree-tracker-backend.herokuapp.com/users/filtered/${user.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      .then(r => r.json())
      .then(users => {
        // console.log(users)
        setUsers(users)
        setDisplayUsers(users)
      })
    }
  }, [user])

  
  function handleChange(e) {
    console.log(e.target.value)

    setDisplayUsers(users.filter(user => user.username.includes(e.target.value)))
    console.log(displayUsers)
  }


  return (
    <div className='search-container'>
      <input type="text" placeholder="Search" className='search-bar' onChange={handleChange}/>
      <div className='search-results'>
        {displayUsers.map(displayUser => {
          // console.log(user.username)
          return (
            <UserCard displayUser={displayUser} user={user} key={displayUser.id}/>
          )
        })}
      </div>
    </div>
  )
}
