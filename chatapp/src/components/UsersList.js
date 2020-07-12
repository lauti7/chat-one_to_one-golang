import React from 'react'
import {useAuth} from '../auth'
import { ListGroup, ListGroupItem, Badge, Button } from 'reactstrap';

const UsersList = ({users}) => {

  const {state, dispatch} = useAuth()

  const selectChat = id => {
    const chat = {
      type: "one-to-one",
      participants: [{user_id: state.authId}, {user_id: id}]
    }
    fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(chat)
    })
    .then(res => res.json())
    .then(json => {
      dispatch({
        type: "SELECTCHAT",
        currentChat: json.chat //TODO: remove messages array sent from backend
      })
    })
  }

  return (
    <ListGroup>
      {
        users.map(user => {
          return (
            <ListGroupItem key={user.id | user.user_id}>
              <div className="d-flex justify-content-between">
                <p className="m-0 p-0">{user.user_name}</p>
                <Button size="sm" onClick={() => selectChat(user.id | user.user_id)}>Select</Button>
              </div>
            </ListGroupItem>
          )
        })
      }
    </ListGroup>
  )
}

export default UsersList
