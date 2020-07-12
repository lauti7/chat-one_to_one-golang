import React from 'react';
import {Row, Col, Card} from 'reactstrap'
import {useAuth} from '../auth'


const Message = ({msg}) => {

  const {state} = useAuth()

  return (
    <Row>
      <Col md="12">
        <Card body inverse style={{ marginTop: "4px",backgroundColor: '#333', borderColor: '#333', height: "100px" }}>
          <div className="d-flex">
            <p className="px-1">{msg.user_id === state.authId ? "You" : state.currentChat.users[0].user_name}</p>
            <p className="px-1">{msg.created_at}</p>
          </div>
          <p className="px-1">{msg.content}</p>
        </Card>
      </Col>
    </Row>
  )
}

export default Message
