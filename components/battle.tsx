import React, { useState } from "react";
import { Button, TextInput, Group, Grid, Paper } from "@mantine/core";
import ChatColumn from "./ChatColumn";
import {
  ChatMessage,
  Chats,
  Models,
  BattleTypes,
  ChatSettings,
} from "../pages/index";

interface BattleProps {
  getCompletion: (messages: ChatMessage[], chat: Chats, model: Models) => void;
  isChatbotATyping: boolean;
  isChatbotBTyping: boolean;
  chatStarted: boolean;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setChatAMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  setChatBMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatAMessages: ChatMessage[];
  chatBMessages: ChatMessage[];
  setIsChatbotATyping: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChatbotBTyping: React.Dispatch<React.SetStateAction<boolean>>;
  winner: Chats | null;
  setWinner: React.Dispatch<React.SetStateAction<Chats | null>>;
  handleResetChats: (battleType: BattleTypes) => void;
  battleType: BattleTypes;
  chatASettings: ChatSettings;
  chatBSettings: ChatSettings;
}

const Battle = (props: BattleProps) => {
  const {
    getCompletion,
    isChatbotATyping,
    isChatbotBTyping,
    chatStarted,
    inputValue,
    setInputValue,
    setChatAMessages,
    setChatBMessages,
    chatAMessages,
    chatBMessages,
    setIsChatbotATyping,
    setIsChatbotBTyping,
    winner,
    setWinner,
    handleResetChats,
    battleType,
    chatASettings,
    chatBSettings,
  } = props;

  const handleMessageSend = async () => {
    setIsChatbotATyping(true);
    setIsChatbotBTyping(true);

    if (chatStarted) {
      const newUserMessage: ChatMessage = { role: "user", content: inputValue };

      const newChatA = [...chatAMessages, newUserMessage];
      const newChatB = [...chatBMessages, newUserMessage];

      setChatAMessages(newChatA);
      setChatBMessages(newChatB);

      setInputValue("");

      switch (battleType) {
        case BattleTypes.PROMPT:
          if (chatASettings.model) {
            await getCompletion(newChatA, Chats.CHAT_A, chatASettings.model);
            await getCompletion(newChatB, Chats.CHAT_B, chatASettings.model);
          }
          break;
        case BattleTypes.MODEL:
          if (chatASettings.model && chatBSettings.model) {
            await getCompletion(newChatA, Chats.CHAT_A, chatASettings.model);
            await getCompletion(newChatB, Chats.CHAT_B, chatBSettings.model);
          }
          break;
      }
    } else {
      switch (battleType) {
        case BattleTypes.PROMPT:
          if (chatASettings.model) {
            await getCompletion(
              chatAMessages,
              Chats.CHAT_A,
              chatASettings.model
            );
            await getCompletion(
              chatBMessages,
              Chats.CHAT_B,
              chatASettings.model
            );
          }
          break;
        case BattleTypes.MODEL:
          if (chatASettings.model && chatBSettings.model) {
            await getCompletion(
              chatAMessages,
              Chats.CHAT_A,
              chatASettings.model
            );
            await getCompletion(
              chatBMessages,
              Chats.CHAT_B,
              chatBSettings.model
            );
          }
          break;
      }
    }
  };

  const disableInputs =
    !chatStarted || isChatbotATyping || isChatbotBTyping || !!winner;

  return (
    <Paper shadow="xs" radius={5} withBorder p="xl" mt="20">
      <Grid>
        <Grid.Col span={6}>
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <ChatColumn
              messages={chatAMessages}
              typing={isChatbotATyping}
              chat={Chats.CHAT_A}
              winner={winner}
            />
            <Button
              variant="outline"
              onClick={() => setWinner(Chats.CHAT_A)}
              disabled={disableInputs}
              style={{ alignSelf: "flex-end" }}
            >
              👈 Left is better
            </Button>
          </div>
        </Grid.Col>
        <Grid.Col span={6}>
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <ChatColumn
              messages={chatBMessages}
              typing={isChatbotBTyping}
              chat={Chats.CHAT_B}
              winner={winner}
            />
            <Button
              variant="outline"
              onClick={() => setWinner(Chats.CHAT_B)}
              disabled={disableInputs}
              style={{ alignSelf: "flex-start" }}
            >
              👉 Right is better
            </Button>
          </div>
        </Grid.Col>
      </Grid>

      <Group style={{ marginTop: "20px" }}>
        <TextInput
          placeholder="Type a message..."
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          onKeyPress={(event) => event.key === "Enter" && handleMessageSend()}
          style={{ flexGrow: 1, maxWidth: "80%" }}
          disabled={disableInputs}
        />
        <Button
          onClick={handleMessageSend}
          disabled={isChatbotATyping || isChatbotBTyping || !!winner}
        >
          {chatStarted ? "Send" : "Start chat"}
        </Button>
      </Group>
      <Group>
        <Button
          my={10}
          color="red"
          variant="outline"
          onClick={() => handleResetChats(battleType)}
        >
          Reset
        </Button>
      </Group>
    </Paper>
  );
};

export default Battle;
