import React, { useEffect } from "react";
import { Paper, Text, ScrollArea, useMantineTheme } from "@mantine/core";
import TypingIndicator from "./TypingIndicator";
import { Chat } from "../pages/index";

interface ChatColumnProps {
  chat: Chat;
}

const ChatColumn = (props: ChatColumnProps) => {
  const theme = useMantineTheme();
  const { chat } = props;

  useEffect(() => {
    console.log("messages", chat.messages);
  }, [chat.messages]);

  return (
    <>
      <Paper
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderColor: chat.isWinner ? "blue" : "white",
          borderStyle: chat.isWinner ? "solid" : "solid",
        }}
      >
        <Text size="lg" mb="md">
          {chat.name}
        </Text>
        <ScrollArea style={{ height: 375 }}>
          {chat.messages
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
          {chat.botTyping && <TypingIndicator />}
        </ScrollArea>
      </Paper>
    </>
  );
};

export default ChatColumn;
