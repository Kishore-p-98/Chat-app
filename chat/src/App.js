import React from 'react';
//import * as Chatkit from '@pusher/chatkit-server';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import MessageList from './components/MessageList';
import NewRoomForm from './components/NewRoomForm';
import RoomList from './components/RoomList';
import SendMessageForm from './components/SendMessageForm';
import { tokenUrl, instanceLocator } from './config';


class App extends React.Component {
    
  constructor()
  {
    super();
    this.state = {
      roomId : null,
      messages : [],
      joinableRooms : [],
      joinedRooms : [],
    }

    this.sendMessage = this.sendMessage.bind(this);
    this.subscribeToRoom=this.subscribeToRoom.bind(this);
    this.getRooms=this.getRooms.bind(this);
    this.createRoom=this.createRoom.bind(this);
  }



  componentDidMount() {
    
    const Token = new TokenProvider({ url:tokenUrl });
  
    const chatManager = new ChatManager({
      instanceLocator: instanceLocator,
      userId: 'Kishore',
      tokenProvider: Token ,
    });
    
 
    chatManager.connect()
    .then(currentUser => {
        this.currentUser = currentUser;
        this.getRooms();
    })
    .catch(err => console.log('error on connecting: ', err))

}

   getRooms()
   {
    this.currentUser.getJoinableRooms()
    .then(joinableRooms => {
        this.setState({
            joinableRooms,
            joinedRooms: this.currentUser.rooms
        })
    })
    .catch(err => console.log('error on joinableRooms: ', err))
   }

   subscribeToRoom(roomId)
   {
    this.setState({ messages: [] }) 
    this.currentUser.subscribeToRoom({
      roomId: roomId,
      hooks: {
          onMessage: message => {
              this.setState({messages : [...this.state.messages , message]});
          }
      }
     })
     .then(room => {
      this.setState({
          roomId: room.id
      })
      this.getRooms()
     })
     .catch(err => console.log('error on subscribing to room: ', err))
   }
   
 
   sendMessage(text)
  {
    this.currentUser.sendMessage({
      text : text,
      roomId: this.state.roomId , 
     })
  }

  createRoom(roomName)
  {
    this.currentUser.createRoom({
      name : roomName,
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log('error with createRoom: ', err)) 
  }


  render() {
     
    return (
      
      <div className="app" >
        <MessageList 
         roomId={this.state.roomId}
         messages={this.state.messages} />
        
        <NewRoomForm createRoom={this.createRoom} />
        
        <RoomList 
          roomId={this.state.roomId}
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} 
          subscribeToRoom={this.subscribeToRoom}/>
        
        <SendMessageForm  
         disabled={!this.state.roomId}
         sendMessage={this.sendMessage} />
      </div>
    );
  }
}

export default App;
