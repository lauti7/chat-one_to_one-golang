# chat-onetoone-golang
Chat One to One built with GoLang Backend and ReactJS UI.

## Prerequisites
1. GoLang installed.
2. MySql.
3. Node and NPM installed.

## Libraries
1. Gin-Gonic.
2. Gorilla WebSockets.
3. Gorm ORM.

## Features
* One to one.
* Update other users status (Online / Offline).
* App notification if user don't have a selected chat. 

## How to run ?
1. Create new database in MySql with this name: `chatgolang`.
2. Open your terminal and run: `cd $GOPATH`
3. After that, run: `git clone https://github.com/lauti7/chat-onetoone-golang chat`
4. Type: `cd chat/backend`.
5. Run: `go get ./...` then run: `go run *.go`.
6. Open a new terminal tab in root project folder and run: `cd chatapp && npm install`
7. `npm start`

Now, on port `:8080` is running Golang Backend and on port `:3000` is running React.

### TODOs
* Add `Typing Event` in frontend.
* Chat Groups (Now only one to one).
