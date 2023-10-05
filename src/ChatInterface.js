import logo from './logo6.png';
import sendBtn from './send1.svg';
import React, { useState, useRef } from 'react';
import './ChatInterface.css';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';
import iconImage from './logout1.png';
import avatar from './user1.png';
import { Storage } from "@aws-amplify/storage";
import { API } from 'aws-amplify';

import { v4 as uuidv4 } from 'uuid';

Storage.configure({ region: 'us-east-1' });

function ChatInterface({ signOut }) {
  const { user } = useAuthenticator((context) => [context.user]);

  const [uploadedFileName, setUploadedFileName] = useState('');
  const [docid, setDocid] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! How can I assist you with your PDF needs?", type: "received" },
  ]);
  const [messageInput, setMessageInput] = useState('');

  const fileInputRef = useRef(null);

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Generate a unique file name
        const fileName = `${docid}_${Date.now()}_${file.name}`;

        // Upload the file to AWS S3
        await Storage.put(fileName, file);

        // Set the uploaded file name in state
        setUploadedFileName(file.name);
        setDocid(uuidv4());
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const callLambdaFunction = async () => {
    try {
      const response = await API.post('bridge1', '/chatbot', {
        body: { question: messageInput },
      });

      if (response.ok) {
        const data = await response.json();
        const answer = data.answer;
        setChatMessages([...chatMessages, { text: answer, type: "received" }]);
      } else {
        console.error('API response not okay:', response);
        // Handle API error responses here
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === '') {
      return;
    }

    setChatMessages([...chatMessages, { text: messageInput, type: "sent" }]);
    setMessageInput('');

    // Call the Lambda function with the user's question
    callLambdaFunction();
  };


  return (
    <div className="App1">
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={logo} className="logoImage" alt="Kontent Konversation logo" />
          </div>
          <div className="upperSideBottom">
            {/* Add the file input container */}
            <div className="uploadContainer">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="uploadInput"
                onChange={handleFileSelect}
                id="fileInput"
              />
              <button
              className="uploadLabel"
              onClick={openFileInput}
            >
              Choose PDF File
            </button>
             <div className="uploadmsg" >
              {uploadedFileName && (
                <p>Uploaded File: {uploadedFileName}</p>
              )}
             <p> Document id: {docid}</p>
             </div>
            </div>
          </div>
        </div>
          <div className="userDetails">
           <img
              src={avatar} // Replace with the URL of the user's icon image
              className="userIcon"
              alt="User Icon"
            />
            
            <p className="userName">@{user.username}</p> 
          </div>
        <div className="lowerSide">
        
          <div className="signOutContainer">
            <button className="signOutButton" onClick={signOut}>
              <img src={iconImage} alt="Icon" className="outBtn"  /> 
              Log Out
            </button>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="chats">
          {chatMessages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="messageInputContainer">
          <input
            type="text"
            placeholder="Type a message..."
            className="messageInput"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button className="sendMessageButton" onClick={handleSendMessage}>
            <img src={sendBtn} alt="send" />
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default withAuthenticator(ChatInterface);
