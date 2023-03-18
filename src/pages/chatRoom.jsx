
import React, { useState } from 'react'
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import {AppBar, Link, Toolbar, Typography} from "@mui/material";

const API_KEY = "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";
const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": "Explain things as best as you can"
}

function Chatroom() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm DCHAT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(apiRequestBody)
        }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

  return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ height: "80vh", width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

          <MainContainer style={{
            backgroundColor: '#f2f2f2',
            borderRadius: '30px',
            boxShadow: '0px 0px 10px 5px rgba(0,0,0,0.1)',
            width: '100%',
            display: 'flex', // Add this line
            flexGrow: 1, // Add this line
          }}>

            <ChatContainer style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: '0px 0px 10px 5px rgba(0,0,0,0.1)',
              flexGrow: 1, // Add this line
               // Add this line
            }}>
              <MessageList
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #f5f5f5 0%, rgba(63,181,171,0.25) 100%)',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0px 0px 10px 5px rgba(0,0,0,0.1)',


                  }}
                  scrollBehavior="smooth"
                  typingIndicator={isTyping ? <TypingIndicator content="he is typing" /> : null}
              >
                {messages.map((message, i) => {
                  console.log(message)
                  return <Message style={{

                    borderRadius: '10px',


                  }} key={i} model={message} />
                })}
              </MessageList>
              <MessageInput style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                padding: '10px',
                margin: '10px',
                boxShadow: '0px 0px 10px 5px rgba(0,0,0,0.1)',
              }} placeholder="Type message here" onSend={handleSend} />
            </ChatContainer>
          </MainContainer>

        </div>




      </div>
  )
}

export default Chatroom
