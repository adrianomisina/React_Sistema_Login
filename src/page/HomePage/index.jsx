import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../contexts/auth';
import { getUsers } from '../../services/api';

const HomePage = () => {

  const { authenticated ,logout } = useContext(AuthContext);
  const [users, setUsers] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(()=> {
    (async () => {
      const response = await getUsers()
      setUsers(response.data)
      setLoading(false)
    })()
  },[])
  
  const handleLogout = () => {
    logout()
  }

  if(loading) {
    return <div className='loading'>Carregando dados...</div>
  }

  return (
    <>
      <h1>HomePage</h1>
      <p>{String(authenticated)}</p>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {users.map((user)=> (
          <li key={user.id}>
            {user._id} - {user.email} - {user.password}
          </li>
      ))}
      </ul>
    </>
  );
}

export default HomePage