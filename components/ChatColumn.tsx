import React, { useEffect } from "react";
import { Paper, Text, ScrollArea, Grid, useMantineTheme } from "@mantine/core";
import { ChatMessage } from "../pages/index";
import TypingIndicator from "./TypingIndicator";
import { BattleTypes, Chats } from "../pages/index";

interface ChatColumnProps {
  messages: ChatMessage[];
  typing: boolean;
  chat: Chats;
  winner: Chats | null;
}

const ChatColumn = (props: ChatColumnProps) => {
  const theme = useMantineTheme();
  const { messages, typing, chat, winner } = props;

  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

  return (
    <>
      <Paper
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderColor: chat === winner ? "blue" : "white",
          borderStyle: chat === winner ? "solid" : "solid",
        }}
      >
        <Text size="lg" mb="md">
          {chat}
        </Text>
        <ScrollArea style={{ height: 375 }}>
          {messages
            .filter((message) => message.role !== "system")
            .map((message, index) => (
              <Paper
                key={index}
                style={{
                  margin: "10px",
                  padding: "10px",
                  backgroundColor:
                    message.role === "user"
                      ? theme.colors.blue[1]
                      : theme.colors.gray[1],
                  alignSelf:
                    message.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Text size="sm">{message.content}</Text>
              </Paper>
            ))}
          {typing && <TypingIndicator />}
        </ScrollArea>
      </Paper>
    </>
  );
};

export default ChatColumn;
