import React, {useReducer, useEffect} from 'react';
import {AuthContext} from './auth.js'
import {Container, Col, Row} from 'reactstrap'
import NavBar from './components/NavBar'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const connectToWS = (id) => {
  var ws = new WebSocket(`ws://127.0.0.1:8080/api/ws?user_id=${id}`)
  return ws
}

const authId = JSON.parse(localStorage.getItem("authId"))
const userName = JSON.parse(localStorage.getItem("userName"))


const initialState = {
  users: [],
  onlineUsers: [],
  isAuthenticated: authId ? authId : false,
  authId: authId ? authId : null,
  userName: userName ? userName : null,
  currentChat: null
}

if (initialState.isAuthenticated) {
  let ws = connectToWS(initialState.authId)
  initialState.ws = ws
} else {
  initialState.ws = null
}
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("authId", JSON.stringify(action.user.id))
      localStorage.setItem("userName", JSON.stringify(action.user.user_name))
      let ws = connectToWS(action.user.id)
      console.log(action);
      return {
        ...state,
        isAuthenticated: true,
        authId: action.user.id,
        userName: action.user.user_name,
        ws: ws,
        currentChat: null
      }
    case "LOGOUT":
      localStorage.clear()
      state.ws.close()
      return {
        ...state,
        isAuthenticated: false,
        authId: null,
        useState: null,
        ws:null
      }
    case "SELECTCHAT":
      return {
        ...state,
        currentChat: action.currentChat
      }
    case "FETCHUSERS":
      console.log(action.users);
      return {
        ...state,
        users: [...action.users]
      }
    case "ONLINEUSERS":
      let onlineUsers = [...action.users].filter(u => u.user_id !== state.authId)
      return {
        ...state,
        onlineUsers: [...onlineUsers]
      }
    case "NEWCHATMESSAGE":
      if (state.currentChat && state.currentChat.id === action.message.chat_id) {
        let newMsgs = [...state.currentChat.messages, action.message]
        let currChat = {...state.currentChat, messages: newMsgs}
        return {
          ...state,
          currentChat: currChat
        }
      } else {
        toast(`New Message from ${action.message.sender.user_name}`)
        return {
          ...state
        }
      }

  }
}


const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState)


  return (
    <AuthContext.Provider value={{state, dispatch}} >
    <ToastContainer/>
    <NavBar/>
      {
        state.isAuthenticated ?
          <Home/>
        :
        <Container>
          <Row>
            <Col md={6}>
              <Login/>
            </Col>
            <Col md={6}>
              <Register/>
            </Col>
          </Row>
        </Container>
      }
    </AuthContext.Provider>
  );
}

export default App;
