import React from 'react';
import Message from './Message'
import {Row, Col} from 'reactstrap'



const MessagesList = ({messagesList}) => {

  return (
    <Row>
      <Col md={12}>
        <div style={{height: '80vh', overflowY: "scroll"}}>
          {
            messagesList.length > 0 ?
              messagesList.map(msg => <Message key={msg.id} msg={msg}/> )
            : ''
          }
        </div>
      </Col>
    </Row>
  )
}

export default MessagesList
