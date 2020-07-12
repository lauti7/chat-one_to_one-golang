import React, {useEffect} from 'react'
import {useAuth} from '../auth'
import {Container, Row, Col} from 'reactstrap'
import Users from './Users'
import OneToOneChat from './OneToOneChat'

const Home = () => {

  const {state, dispatch} = useAuth()

  const receiveBroadcastedMsg = e => {
    let msg = JSON.parse(e.data)
    console.log(msg);
    switch (msg.type) {
      case "chat":
        dispatch({
          type: "NEWCHATMESSAGE",
          message: msg
        })
      case "users_online":
        dispatch({
          type: "ONLINEUSERS",
          users: msg.online_users ? msg.online_users : []
        })
      default:
        console.log("no type");
    }
  }

  useEffect(() => {
    if (state.ws) {
      state.ws.addEventListener('message', receiveBroadcastedMsg)
    }
    console.log(state.users);
  }, [])

  return (
    <Container fluid>
      <Row>
        <Col md={2}>
          <Users/>
        </Col>
        <Col md={10}>
          {
            state.currentChat ?
              <OneToOneChat/>
            : ''
          }
        </Col>
      </Row>
    </Container>
  )
}

export default Home
