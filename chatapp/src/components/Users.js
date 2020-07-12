import React, {useState, useEffect} from 'react'
import {useAuth} from '../auth'
import {Container, Row, Col} from 'reactstrap'
import UsersList  from './UsersList'


const Users = () => {

  const {state, dispatch} = useAuth()

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users", {
      method: "GET",
      headers: {
        "Authorization": state.authId
      }
    })
    .then(res => res.json())
    .then(json => {
      dispatch({
        type:"FETCHUSERS",
        users: json.users
      })
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="mt-3">
      <div className="p-1">
        <h5>Online Users Now</h5>
        <UsersList users={state.onlineUsers}/>
      </div>
      <div className="p-1">
        <h5>All Users</h5>
        <UsersList users={state.users}/>
      </div>
    </div>
  )
}

export default Users
