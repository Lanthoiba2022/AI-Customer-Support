import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, IconButton } from '@mui/material';
import { Send, Brightness4, Brightness7 } from '@mui/icons-material';
import { marked } from 'marked';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string, user: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, user: 'User' }]);
      setInput('');
      setLoading(true);
      setIsTyping(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: input }),
        });

        const data = await response.json();
        //@ts-ignore
        setMessages([...messages, { text: input, user: 'User' }, { text: marked(data.message), user: 'AI' }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages([...messages, { text: input, user: 'User' }, { text: 'Sorry, something went wrong. Please try again.', user: 'AI' }]);
      } finally {
        setLoading(false);
        setIsTyping(false);
      }
    }
  };

  return (
    <div className={`flex flex-col justify-center items-center h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="flex fixed top-0 left-0 w-full items-center h-16  justify-between p-4 bg-gray-800 text-white">
        <Typography variant="h6">HeadStarter AI Customer Support</Typography>
        <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </header>
      {/* <div className='flex flex-col w-fit justify-center items-center '> */}
        <main className=" mb-16 mt-16 p-4 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.user === 'AI' ? 'justify-start' : 'justify-end'}`}>
                <Paper
                  className={`p-4 max-w-md rounded-lg ${message.user === 'AI' ? 'bg-gray-700 text-white' : 'bg-blue-500 text-white'} shadow-md`}
                  elevation={3}
                  style={{ marginBottom: '10px', wordBreak: 'break-word' }} // Add space between messages
                >
                  <Typography
                    variant="body1"
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: message.text }} // Render HTML content
                  />
                </Paper>
              </div>
            ))}
          </div>
        </main>
        <footer className={`fixed bottom-0 right-0 flex items-center w-full h-16 flex-col p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {isTyping && (
            <Typography variant="body2" className={`text-gray-500 ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Headstarter AI is typing...
            </Typography>
          )}
          <div className="flex items-center">
            <TextField
              fullWidth
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              disabled={loading}
              className={`bg-transparent ${darkMode ? 'input-dark' : ''}`}
              InputProps={{
                style: {
                  paddingRight: '8px',
                  height: '40px', // Adjust the height of the input box
                },
                classes: {
                  input: 'placeholder-gray-500', // Higher contrast placeholder text
                }
              }}
              InputLabelProps={{
                style: { color: darkMode ? '#e0e0e0' : '#000' } // Label color for better contrast
              }}
              FormHelperTextProps={{
                style: { color: darkMode ? '#e0e0e0' : '#000' } // Helper text color for better contrast
              }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={sendMessage} 
              endIcon={<Send />}
              disabled={loading}
              className="ml-2"
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </footer>
      {/* </footer> */}
    </div>
  );
};

export default Chat;
