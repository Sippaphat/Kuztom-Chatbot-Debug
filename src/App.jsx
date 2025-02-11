import React from "react";
import AppLayout from "./components/AppLayout";

const mockContacts = []; // Example contacts if needed
// const mockConversation = [
//   { sender: "mc", text: "Hey Nikki, how was the game last night?" },
//   { sender: "Nikki", text: "It was amazing! I was on fire!", emphasis: true },
//   { sender: "mc", text: "Oh really? Did you score again like you did last time?" },
//   { sender: "Nikki", text: "Of course! Off the head, yo!", emphasis: true },
//   { sender: "mc", text: "That’s awesome! You’re carrying the team." },
//   { sender: "Nikki", text: "Haha, thanks! What about your weekend?" },
//   { sender: "mc", text: "It was relaxing. Watched some good shows." },
//   { sender: "Nikki", text: "Nice! Any recommendations?" },
//   { sender: "mc", text: "Yeah, you should check out The Crown." },
//   { sender: "Nikki", text: "Will do! Thanks for the tip!", emphasis: true },
// ];

export default function App() {
  return (
    <AppLayout
      contacts={mockContacts}
      conversation={[]}
      onSend={(message) => console.log("Send message:", message)}
    />
  );
}
