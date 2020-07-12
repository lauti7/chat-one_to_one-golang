package main

import (
	"./api/models"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{}

type UsersManager struct {
	OnlineUsers       map[uint]OnlineUser
	RegisterChannel   chan OnlineUser
	UnregisterChannel chan OnlineUser
}

type BroadcastMessage struct {
	ID             string     `json:"id,omitempty"`
	ChatID         uint       `json:"chat_id"`
	Sender         OnlineUser `json:"sender"`
	ReceiverUserID uint       `json:"receiver_user_id"`
	Content        string     `json:"content,omitempty"`
	Type           string     `json:"type"`
}

type OnlineUser struct {
	SocketID      *websocket.Conn       `json:"-"`
	ChatChannel   chan BroadcastMessage `json:"omitempty"`
	TypingChannel chan BroadcastMessage `json:"omitempty"`
	Username      string                `json:"user_name"`
	UserID        uint                  `json:"user_id" form:"user_id"`
}

type OnlineUsersMessage struct {
	OnlineUsers []OnlineUser `json:"online_users"`
	Type        string       `json:"type"`
}

func (manager *UsersManager) handleWS(w http.ResponseWriter, r *http.Request, authUser interface{}) {

	onlineUser := authUser.(OnlineUser)

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Fatal(err)
	}

	onlineUser.SocketID = ws

	defer ws.Close()

	manager.RegisterChannel <- onlineUser

	go onlineUser.chat(manager)

	for {
		fmt.Println("::handleConnections")
		var msg BroadcastMessage

		err := ws.ReadJSON(&msg)

		if err != nil {
			log.Printf("error: %v", err)
			delete(manager.OnlineUsers, onlineUser.UserID)
			break
		}

		msg.Sender = onlineUser

		receiverUser, online := manager.OnlineUsers[msg.ReceiverUserID]

		if online {
			switch msg.Type {
			case "chat":
				receiverUser.ChatChannel <- msg
			case "typing":
				receiverUser.TypingChannel <- msg
			}
		}

		newMessage := models.Message{
			ChatID:     msg.ChatID,
			UserID:     msg.Sender.UserID,
			Content:    msg.Content,
			ReceiverID: msg.ReceiverUserID,
		}
		newMessage.CreateMessage()
		continue
	}
	manager.UnregisterChannel <- onlineUser

}

func (manager *UsersManager) registration() {
	for {
		select {
		case user := <-manager.RegisterChannel:
			manager.OnlineUsers[user.UserID] = user
			manager.sendCurrentUsers(user)
		case user := <-manager.UnregisterChannel:
			delete(manager.OnlineUsers, user.UserID)
			manager.sendCurrentUsers(user)
		}
	}
}

func (user *OnlineUser) chat(manager *UsersManager) {
	for {
		select {
		case msg := <-user.ChatChannel:
			user.receiveMsg(msg, manager)
		case msg := <-user.TypingChannel:
			user.receiveMsg(msg, manager)
		}
	}
}

func (user *OnlineUser) receiveMsg(msg BroadcastMessage, manager *UsersManager) {

	err := user.SocketID.WriteJSON(msg)

	if err != nil {
		log.Printf("Error Routine: %v", err)
		user.SocketID.Close()
		delete(manager.OnlineUsers, user.UserID)
	}
}

func (manager *UsersManager) sendCurrentUsers(u OnlineUser) {
	onlineUsers := OnlineUsersMessage{Type: "users_online"}
	for _, user := range manager.OnlineUsers {
		onlineUsers.OnlineUsers = append(onlineUsers.OnlineUsers, user)
	}
	for _, user := range manager.OnlineUsers {
		err := user.SocketID.WriteJSON(onlineUsers)
		if err != nil {
			log.Printf("Error Routine: %v", err)
			user.SocketID.Close()
			delete(manager.OnlineUsers, user.UserID)
		}
	}
}

func checkAndFindUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		var onlineUser OnlineUser

		c.Bind(&onlineUser)

		username := models.GetUsername(onlineUser.UserID)

		onlineUser.Username = username
		onlineUser.ChatChannel = make(chan BroadcastMessage)
		onlineUser.TypingChannel = make(chan BroadcastMessage)

		c.Set("user", onlineUser)
		c.Next()
	}
}
