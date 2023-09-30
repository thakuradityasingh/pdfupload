import React from 'react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import './dashboard.css'; // Import your custom CSS file
import logo from './logo5.png'; // Import your logo image file

const dashboard = () => {
  return (
    <div className="App1">
      <div className="upperSideTop">
        <img src={logo} className="logoImage" alt="Kontent Konversation logo" />
      </div>

      <div className="container">
        <StorageManager
          acceptedFileTypes={['image/*']}
          accessLevel="public"
          maxFileCount={1}
          isResumable
        />
      </div>
    </div>
  );
};

export default dashboard;
