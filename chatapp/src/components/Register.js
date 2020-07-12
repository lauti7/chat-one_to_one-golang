import React, {useState, useEffect} from 'react'
import {useAuth} from '../auth'
import {Container, Card, Button, Row, Col, FormGroup, Label, Input} from 'reactstrap'

const Register = () => {

  const {state, dispatch} = useAuth()

  const [userName, setUserName] = useState('')

  const register = () => {
    const user = {
      user_name: userName
    }
    fetch(`http://localhost:8080/api/users/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(json => {
      dispatch({
        type: "LOGIN",
        user: json.user
      })
    })
  }

  return (
    <Container>
      <h1>Register</h1>
      <div className="mt-3">
        <Card body>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>User Name</Label>
                <Input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
              </FormGroup>
            </Col>
          </Row>
        </Card>
        <Button className="mt-3" size="lg" style={{backgroundColor: '#00bf8c', borderColor: '#00bf8c'}} onClick={() => register()}>Register</Button>
      </div>
   </Container>
  )
}


export default Register
