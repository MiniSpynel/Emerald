import React, { useRef, useState } from 'react';
import './App.scss';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { HiOutlineChatAlt2, HiOutlineUserCircle, HiOutlineNewspaper } from "react-icons/hi";
import { BiNetworkChart } from "react-icons/bi";
import { RiSettings4Line } from "react-icons/ri";

firebase.initializeApp({
  apiKey: "AIzaSyB2urOIDtoW1mG0Pl5raVZf0qEw2Czn4gI",
  authDomain: "emerald-5d385.firebaseapp.com",
  projectId: "emerald-5d385",
  storageBucket: "emerald-5d385.appspot.com",
  messagingSenderId: "174671197539",
  appId: "1:174671197539:web:ace093ddb3137c2616cf56",
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {user ? <Emerald/> : <SignIn/>}
    </div>
  );
}

function SignIn(props){
  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup( provider).then()
      .catch();
  }

  return (
      <button className='text_button signIn_button' onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(props){
  return auth.currentUser && (
    <button className='text_button signOut_button' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Emerald(props){
  return (
    <div className='Emerald'>
      <NavBar/>
      <ChatRoom/>
      <SignOut/>
    </div>
  )
}

function NavBar(props){
  return (
    <div className='navBar'>
      <IconButton function={() => console.log("button clicked")}>
        <HiOutlineNewspaper color="white" className='icon'/>
      </IconButton>

      <IconButton function={() => console.log("button clicked")}>
        <HiOutlineChatAlt2 color="white" className='icon'/>
      </IconButton>

      <IconButton function={() => console.log("button clicked")}>
        <BiNetworkChart color="white" className='icon'/>
      </IconButton>

      <IconButton function={() => console.log("button clicked")}>
        <HiOutlineUserCircle color="white" className='icon'/>
      </IconButton>

      <IconButton function={() => console.log("button clicked")}>
        <RiSettings4Line color="white" className='icon'/>
      </IconButton>
    </div>
  )
}

function IconButton(props){
  return (
    <div className='iconButton' onClick={props.function}>
      {props.children}
    </div>
  )
}

function ChatRoom(props) {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy('createdAt').limit(30);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const dummy = useRef();

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      content: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      user: uid,
    })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior : 'smooth' });
  }

  if (!messages) {
    return <div>Loading...</div>; // Render a loading state while messages are being fetched
  }

  return (
    <>
      <div className='ChatRoom'>
        <div className='Messages_list'>
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          <div ref={dummy}/>
        </div>
        

        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

          <button className='text_button' type='submit'>Send</button>
        </form>
      </div>

      
    </>
  );
}

function ChatMessage(props){
  const { content, user, photoURL } = props.message;

  const messageClass = user === auth.currentUser.uid ? "sent" : "received";
  console.log(auth.currentUser.uid);

  return (
    <div className={`ChatMessage ${messageClass}`}>
      <div className='user_pfp' src={photoURL}/>
      <div className='ChatMessageContent'>
        {content}
      </div>
      
    </div>
  )
}


export default App;
