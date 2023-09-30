import logo from './logo6.png';
import sendBtn from './send1.svg';
import React, { useState,useRef } from 'react';
import './ChatInterface.css';
import { withAuthenticator,useAuthenticator } from '@aws-amplify/ui-react';
import iconImage from './logout1.png';
import avatar from './user1.png';
import { Storage } from "@aws-amplify/storage"


function ChatInterface({ signOut }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Function to handle file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const fileName = file.name;
        await Storage.put(fileName, file);
        setUploadedFileName(fileName);
        console.log('File uploaded successfully to S3');
      } catch (error) {
        console.error('Error uploading file to S3:', error);
      }
    } else {
      console.warn('No file selected');
    }
  };

  // Function to open the file input dialog
  const openFileInput = () => {
    fileInputRef.current.click();
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
                ref={fileInputRef} // Connect the ref to the file input
                type="file"
                accept=".pdf"
                className="uploadInput"
                onChange={handleFileSelect}
                id="fileInput" // Add an id for the label to reference
              />
              {/* Label that looks like a button */}
              <label
                htmlFor="fileInput"
                className="uploadLabel" // Add a class for styling
                onClick={openFileInput} // Trigger the file input dialog
              >
                Choose PDF File
              </label>
              {/* Display the uploaded file name */}
              {uploadedFileName && (
                <p>Uploaded File: {uploadedFileName}</p>
              )}
            </div>
          </div>
        </div>
          <div className="userDetails">
           <img
              src={avatar} // Replace with the URL of the user's icon image
              className="userIcon"
              alt="User Icon"
            />
            
            <p className="userName">@{user.username}</p> {/* Display user's name */}
          </div>
        <div className="lowerSide">
        
          <div className="signOutContainer">
            <button className="signOutButton" onClick={signOut}>
              <img src={iconImage} alt="Icon" className="outBtn"  /> {/* Set the width and height */}
              Log Out
            </button>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="chats">
          <div className="message received">
            <p>Hello! How can I assist you with your PDF needs?</p>
          </div>
          <div className="message sent">
            <p>I need help with PDF editing.</p>
          </div>
          <div className="message received">
            <p>The best model available in AWS for PDF chat .</p>
          </div>
        </div>
        <div className="messageInputContainer">
          <input
            type="text"
            placeholder="Type a message..."
            className="messageInput"
          />
          <button className="sendMessageButton"><img src={sendBtn} alt="send" /></button>
          
        </div>
        
      </div>
    </div>
  );
}

export default withAuthenticator(ChatInterface);
