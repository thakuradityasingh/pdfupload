
import { Route, Routes, BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import awsExports from './aws-exports';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import ChatInterface from './ChatInterface';
import { View, Image, useTheme, Text } from '@aws-amplify/ui-react';
import logo from './logo5.png';



Amplify.configure(awsExports);

function App() {
  const components = {
    Header() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Image
            alt="Kontent Konversation"
            src={logo}
          />
        </View>
      );
    },
    Footer() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Text color={tokens.colors.neutral[80]}>
            &copy; 2023 Kontent Konversation
          </Text>
        </View>
      );
    },
  };


  return (
    <Authenticator components={components}>
      <div>
        <BrowserRouter> {/* Wrap Routes with BrowserRouter */}
          <Routes>
            <Route path='*' element={<ChatInterface />} />
            <Route path='/' exact={true} element={<ChatInterface />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Authenticator>
  );
}

export default App;
