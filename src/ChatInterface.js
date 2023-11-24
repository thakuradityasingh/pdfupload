import logo from './assets/logo6.png';
import sendBtn from './assets/send1.svg';
import React, { useState, useRef } from 'react';
import './ChatInterface.css';
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';
import iconImage from './assets/logout1.png';
import avatar from './assets/user1.png';
import { Storage } from "@aws-amplify/storage";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "langchain/vectorstores/faiss";
import { BedrockEmbeddings } from "langchain/embeddings/bedrock";
import { Bedrock } from "langchain/llms/bedrock";
import { PdfReader } from "pdfreader";  
import { v4 as uuidv4 } from 'uuid';
import { loadQAStuffChain } from "langchain/chains";


Storage.configure({ region: 'us-east-1' });
let vectorStore;
const bedrockRegion = process.env.bedrock_region;

const client = new Bedrock({ region: bedrockRegion });

const bedrock_embeddings = new BedrockEmbeddings({ client, modelId: 'amazon.titan-embed-text-v1' });

const llm = new Bedrock({ client, modelId: "ai21.j2-ultra-v1" });
llm.model_kwargs = { maxTokens: 2048, temperature: 0.7, topP: 1.0, stopSequences: [] };


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
        
        const fileName = `${docid}_${Date.now()}_${file.name}`;

        
        await Storage.put(fileName, file);

       
        const file = await Storage.get(fileName);
        const pdf = new Uint8Array(file);
        const pdfReader = new PdfReader(pdf);
        const text = '';
        for (const page of pdfReader.pages) {
          text += page.extractText();
        }
        const len = (text) => text.length;

        const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200, lengthFunction: len });
        const chunks = textSplitter.splitText(text);
        const embeddings = bedrock_embeddings();
        

    try {
      vectorStore = await FaissStore.fromTexts(chunks, embeddings);  
    } catch (error) {
      console.error('Error creating store', error);
    }


       

       
        setUploadedFileName(file.name);
        setDocid(uuidv4());
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const callQuesAnsFunction = async (query) => {
    try {
        const query = messageInput;
       
        const docs = vectorStore.similaritySearch({ query, k: 3 });

   
        const stuffChain = loadQAStuffChain(llm);
        
    
        const response =  await stuffChain.call({ inputDocuments: docs, question: query });
        const answer = response;
        setChatMessages([...chatMessages, { text: answer, type: "received" }]);
      
    } catch (error) {
      console.error('Error calling function', error);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() === '') {
      return;
    }

    setChatMessages([...chatMessages, { text: messageInput, type: "sent" }]);
    setMessageInput('');

    
    callQuesAnsFunction();
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
              src={avatar} 
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
