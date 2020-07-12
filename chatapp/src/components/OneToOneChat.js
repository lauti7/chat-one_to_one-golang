import React, {useState, useEffect, useRef} from 'react'
import {useAuth} from '../auth'
import {Container, Row, Col, InputGroup, InputGroupText, Input, InputGroupAddon, Button,} from 'reactstrap'
import MessagesList from './MessagesList'
import md5 from 'md5'


const OneToOneChat = () => {

  const {state, dispatch} = useAuth()

  const [message, setMessage] = useState('')

  const typingRef = useRef()

  const send = () => {
    const newMsg = {
      id: md5(`${message}${state.authId}`),
      chat_id: state.currentChat.id,
      receiver_user_id: state.currentChat.users[0].id,
      content: message,
      type: "chat"
    }
    state.ws.send(JSON.stringify(newMsg))
  }


  return (
    <Container>
     <div style={{padding: '5px', textAlign: 'center', backgroundColor: '#545b62'}}>
        <p style={{color: '#ffff', fontSize: '24px'}}>{state.currentChat.users[0].user_name} </p>
     </div>
     <MessagesList messagesList={state.currentChat.messages ? state.currentChat.messages : []}/>
      <span>
        <p ref={typingRef}></p>
      </span>
      <Row>
        <Col md={8}>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>New Message</InputGroupText>
            </InputGroupAddon>
            <Input value={message} onChange={(e) => {setMessage(e.target.value)}} />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Button color="secondary" size="md" style={{width: '100%'}} active onClick={() => send()}>Send</Button>
        </Col>
      </Row>
    </Container>
  )


}

export default OneToOneChat
