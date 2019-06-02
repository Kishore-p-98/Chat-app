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
      messages : []
    }
  }



  componentDidMount() {
    
    const Token = new TokenProvider({ url:tokenUrl });
  
    const chatManager = new ChatManager({
      instanceLocator: instanceLocator,
      userId: 'Kishore',
      tokenProvider: Token ,
    });
    
  /*  chatManager.connect()
  .then(currentUser => {
    console.log('Successful connection', currentUser)
  })
  .catch(err => {
    console.log('Error on connection', err)
  })
  */

    chatManager.connect()
    .then(currentUser => {
        currentUser.subscribeToRoom({
            roomId: '19419393',
            hooks: {
                onMessage: message => {
                    this.setState({messages : [...this.state.messages , message]});
                }
            }
        })
    })
    
  
}




  render() {

    return (
      <div className="app" >
        <MessageList messages={this.state.messages} />
        <NewRoomForm />
        <RoomList />
        <SendMessageForm />
      </div>
    );
  }
}

export default App;
