import React, { useState } from "react";
import { AiOutlineUser, AiOutlineEllipsis, AiOutlineMessage } from "react-icons/ai";

const agents = [
  { name: "Initial_Convsum_Agent", icon: <AiOutlineUser /> },
  { name: "Classifier_Agent", icon: <AiOutlineUser /> },
  { name: "Repond_Agent", icon: <AiOutlineUser /> },
  { name: "Repond_Extract_Agent", icon: <AiOutlineUser /> },
  { name: "Image_Agent", icon: <AiOutlineUser /> },
  { name: "Query_Maker_Agent", icon: <AiOutlineUser /> },
  { name: "Rag_Agent", icon: <AiOutlineUser /> },
  { name: "RS_Agent", icon: <AiOutlineUser /> },
  { name: "Final_Repond_Agent", icon: <AiOutlineUser /> },
  { name: "Final_Repond_Extract_Agent", icon: <AiOutlineUser /> },
  { name: "Final_Convsum_Agent", icon: <AiOutlineUser /> },
];

const shops = {
  "P'Neung": "95ba4d0d-c5ac-43fc-acf8-a2ba4d5aef3b",
  "Aj'Pooh": "3833993e-2bcd-41e6-af1b-b8d115aafae0",
  "Flight": "88f887a0-8ea2-4a53-9ea2-73846c704934"
};

const initialUserIds = ["pluemtest", "user1", "user2"]; // Add your user IDs here

export default function AppLayout({ contacts, conversation = mockConversation, onSend }) {
  const [conversationHistory, setConversationHistory] = useState({});
  const [filteredConversation, setFilteredConversation] = useState([]);
  const [currentView, setCurrentView] = useState("chatHistory");

  const [messageInput, setMessageInput] = useState("");
  const [selectedImage, setSelectedImage] = useState("None");
  const [agentThoughts, setAgentThoughts] = useState({});
  const [selectedShop, setSelectedShop] = useState(Object.keys(shops)[0]);
  const [selectedUserId, setSelectedUserId] = useState(initialUserIds[0]); // Add state for selected user ID
  const [userIds, setUserIds] = useState(initialUserIds); // State for user IDs
  const [newUserId, setNewUserId] = useState(""); // State for new user ID input

  const maxVisibleAgents = 5;
  const visibleAgents = agents.slice(0, maxVisibleAgents);
  const moreAgents = agents.slice(maxVisibleAgents);

  function appendAgentThoughts(debugLog) {
    setAgentThoughts((prevThoughts) => {
      let updatedThoughts = { ...prevThoughts };
      const shopId = selectedShop;
      const userId = selectedUserId;

      if (!updatedThoughts[shopId]) {
        updatedThoughts[shopId] = {};
      }

      if (!updatedThoughts[shopId][userId]) {
        updatedThoughts[shopId][userId] = {};
      }

      for (let key in debugLog) {
        if (key.endsWith("_Agent")) {
          if (!updatedThoughts[shopId][userId][key]) {
            updatedThoughts[shopId][userId][key] = []; // Initialize as an array if not present
          }

          let responseText;
          if (typeof debugLog[key] === "string") {
            responseText = debugLog[key];
          } else if (typeof debugLog[key] === "object") {
            responseText = JSON.stringify(debugLog[key]);
          } else {
            responseText = debugLog[key];
          }

          updatedThoughts[shopId][userId][key] = [
            ...updatedThoughts[shopId][userId][key],
            { input: debugLog["user_input"], response: responseText },
          ];
        }
      }
      return updatedThoughts;
    });
  }

  const handleChatHistoryClick = () => {
    setCurrentView("chatHistory");
    setFilteredConversation(conversationHistory[selectedShop]?.[selectedUserId] || []);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const shopId = shops[selectedShop];
    const userId = selectedUserId;

    const newMessage = { sender: "User", text: messageInput };
    const newHistory = [...(conversationHistory[shopId]?.[userId] || []), newMessage];
    setConversationHistory((prevHistory) => ({
      ...prevHistory,
      [shopId]: {
        ...prevHistory[shopId],
        [userId]: newHistory,
      },
    }));
    if (currentView === "chatHistory") {
      setFilteredConversation(newHistory);
    }

    const payload = {
      shop_id: shopId,
      user_id: userId,
      user_input: messageInput,
      image: selectedImage,
    };

    try {
      const response = await fetch("http://127.0.0.1:5050/dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      appendAgentThoughts(result);
      const botReply = result.Final_output || "No response received";
      const botMessage = { sender: "Bot", text: botReply };
      const updatedHistory = [...newHistory, botMessage];
      setConversationHistory((prevHistory) => ({
        ...prevHistory,
        [shopId]: {
          ...prevHistory[shopId],
          [userId]: updatedHistory,
        },
      }));
      if (currentView === "chatHistory") {
        setFilteredConversation(updatedHistory);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg = { sender: "Bot", text: "Error sending message." };
      const updatedHistory = [...newHistory, errorMsg];
      setConversationHistory((prevHistory) => ({
        ...prevHistory,
        [shopId]: {
          ...prevHistory[shopId],
          [userId]: updatedHistory,
        },
      }));
      if (currentView === "chatHistory") {
        setFilteredConversation(updatedHistory);
      }
    }
    setMessageInput("");
    setSelectedImage("None");
  };

  const handleAgentClick = (agentName) => {
    setCurrentView(agentName);
    setFilteredConversation(agentThoughts[selectedShop]?.[selectedUserId]?.[agentName] || []);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleAddUserId = () => {
    if (newUserId.trim() && !userIds.includes(newUserId)) {
      setUserIds([...userIds, newUserId]);
      setSelectedUserId(newUserId);
      setNewUserId("");
    }
  };

  const handleUserIdChange = (e) => {
    const newUserId = e.target.value;
    setSelectedUserId(newUserId);
    setFilteredConversation(conversationHistory[selectedShop]?.[newUserId] || []);
  };

  const handleShopChange = (e) => {
    const newShopId = e.target.value;
    setSelectedShop(newShopId);
    setFilteredConversation(conversationHistory[newShopId]?.[selectedUserId] || []);
  };

  return (
    <div className="msn-window">
      {/* Title Bar */}
      <div className="title-bar flex items-center justify-between px-4 py-1">
        <span className="title-text font-bold text-white">SellerSideKicks - Conversation</span>
        <div className="window-controls flex space-x-2">
          <button className="control-button minimize"></button>
          <button className="control-button maximize"></button>
          <button className="control-button close"></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="msn-container flex flex-col h-full">
        {/* Toolbar */}
        <div className="msn-toolbar">
          {visibleAgents.map((agent, index) => (
            <div key={index} className="toolbar-item" onClick={() => handleAgentClick(agent.name)}>
              <div className="toolbar-icon">{agent.icon}</div>
              <span className="toolbar-label">{agent.name}</span>
            </div>
          ))}
          {moreAgents.length > 0 && (
            <div className="toolbar-item dropdown">
              <div className="toolbar-icon">
                <AiOutlineEllipsis />
              </div>
              <span className="toolbar-label">More Agents</span>
              <div className="dropdown-content">
                {moreAgents.map((agent, index) => (
                  <div key={index} className="dropdown-item" onClick={() => handleAgentClick(agent.name)}>
                    <div className="dropdown-icon">{agent.icon}</div>
                    {agent.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="toolbar-item" onClick={handleChatHistoryClick}>
            <div className="toolbar-icon">
              <AiOutlineMessage />
            </div>
            <span className="toolbar-label">Chat History</span>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex flex-col flex-1">
          <div className="main-container">
            {/* Top Section */}
            <div className="top-section">
              {/* Chat Log */}
              <div className="chat-log-container">
                <div className="chat-log-header">
                  {currentView === "chatHistory" ? (
                    <>To: <span className="recipient-name">mc</span></>
                  ) : (
                    <><span className="recipient-name">{currentView} Thought</span></>
                  )}
                </div>
                <div className="chat-log-messages agent-thought-container">
                  {currentView === "chatHistory"
                    ? filteredConversation.map((msg, index) => (
                        <div key={index} className="chat-message">
                          <span
                            className={`message-sender ${msg.sender === "User" ? "user" : "agent"}`}>
                            {msg.sender === "User" ? selectedUserId : selectedShop} says:
                          </span>
                          <span className={`message-text`} style={{ color: msg.sender === "User" ? "black" : "green" }}> {msg.text} </span>
                        </div>
                      ))
                    : filteredConversation.map((msg, index) => (
                        <div key={index} className="agent-thought-message">
                          <div className="input-message">
                            <strong>Input:</strong> {msg.input}
                          </div>
                          <div className="response-message">
                            <strong>{currentView} Response:</strong> {msg.response}
                          </div>
                        </div>
                      ))}
                </div>
              </div>

              {/* Agent Picture */}
              <div className="agent-picture-container">
                <img
                  src="src/components/Agent.png" // Replace with your actual image path
                  alt="Agent"
                  className="agent-picture"
                />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="bottom-section">
              {/* Shop Selection */}
              <div className="shop-selection-container">
                <label htmlFor="shopSelect" className="shop-select-label">
                  Shop:
                </label>
                <select
                  id="shopSelect"
                  className="shop-select"
                  value={selectedShop}
                  onChange={handleShopChange}
                >
                  {Object.keys(shops).map((shopName, index) => (
                    <option key={index} value={shopName}>
                      {shopName}
                    </option>
                  ))}
                </select>
              </div>
              {/* User ID Selection */}
              <div className="user-id-selection-container">
                <label htmlFor="userIdSelect" className="user-id-select-label">
                  User ID:
                </label>
                <select
                  id="userIdSelect"
                  className="user-id-select"
                  value={selectedUserId}
                  onChange={handleUserIdChange}
                >
                  {userIds.map((userId, index) => (
                    <option key={index} value={userId}>
                      {userId}
                    </option>
                  ))}
                </select>
                <div className="new-user-id-container">
                  <input
                    type="text"
                    className="new-user-id-input"
                    placeholder="New User ID"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value)}
                  />
                  <button className="add-user-id-button" onClick={handleAddUserId}>
                    Add
                  </button>
                </div>
              </div>
              {/* Message Input */}
              <div className="message-input-container">
                <textarea
                  className="message-input"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                ></textarea>
                <button className="send-button" onClick={handleSendMessage}>
                  Send
                </button>
              </div>

              {/* Send Picture */}
              <div className="picture-send-container">
                <img
                  src={selectedImage !== "None" ? selectedImage : "src/components/1695825196046.jpg"}
                  alt="Send Picture"
                  className="picture-send-icon"
                  onClick={() => document.getElementById("imageUpload").click()}
                />
                <button className="dropdown-button" onClick={() => document.getElementById("imageUpload").click()}>
                  ▼
                </button>
                {/* Hidden file input */}
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}