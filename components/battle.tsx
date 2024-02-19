import React, { useState, useEffect } from "react";
import { Button, TextInput, Group, Grid, Paper } from "@mantine/core";
import ChatColumn from "./ChatColumn";
import { ChatMessage, BattleTypes, Chat } from "../pages/index";

interface BattleProps {
  chatA: Chat;
  chatB: Chat;
  setChatA: React.Dispatch<React.SetStateAction<Chat>>;
  setChatB: React.Dispatch<React.SetStateAction<Chat>>;
  getCompletion: (chat: Chat) => void;
  chatStarted: boolean;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleResetChats: (battleType: BattleTypes) => void;
  battleType: BattleTypes;
}

const Battle = (props: BattleProps) => {
  const {
    chatA,
    chatB,
    setChatA,
    setChatB,
    getCompletion,
    chatStarted,
    inputValue,
    setInputValue,
    handleResetChats,
    battleType,
  } = props;

  const [disableInputs, setDisableInputs] = useState(false);

  useEffect(() => {
    if (
      !chatStarted ||
      chatA.botTyping ||
      chatB.botTyping ||
      chatA.isWinner ||
      chatB.isWinner
    ) {
      setDisableInputs(true);
    } else {
      setDisableInputs(false);
    }
  }, [
    chatA.botTyping,
    chatB.botTyping,
    chatA.isWinner,
    chatB.isWinner,
    chatStarted,
  ]);

  const handleMessageSend = async () => {
    setChatA((prevChatA) => ({ ...prevChatA, botTyping: true }));
    setChatB((prevChatB) => ({ ...prevChatB, botTyping: true }));

    if (chatStarted) {
      const newUserMessage: ChatMessage = { role: "user", content: inputValue };

      const newChatA = {
        ...chatA,
        messages: [...chatA.messages, newUserMessage],
      };
      const newChatB = {
        ...chatB,
        messages: [...chatB.messages, newUserMessage],
      };

      setChatA((prevChatA) => ({
        ...prevChatA,
        messages: [...prevChatA.messages, newUserMessage],
      }));
      setChatB((prevChatB) => ({
        ...prevChatB,
        messages: [...prevChatB.messages, newUserMessage],
      }));

      setInputValue("");

      switch (battleType) {
        case BattleTypes.PROMPT:
          if (chatA.settings.model) {
            await getCompletion(newChatA);
            await getCompletion(newChatB);
          } else {
            console.error("chatA.settings.model is null");
          }
          break;
        case BattleTypes.MODEL:
          if (chatA.settings.model && chatB.settings.model) {
            await getCompletion(newChatA);
            await getCompletion(newChatB);
          } else {
            console.error(
              "chatA.settings.model or chatB.settings.model is null"
            );
          }
          break;
      }
    } else {
      handleResetChats(battleType);
      switch (battleType) {
        case BattleTypes.PROMPT:
          if (chatA.settings.model) {
            await getCompletion(chatA);
            await getCompletion(chatB);
          } else {
            console.error("chatA.settings.model is null");
          }
          break;
        case BattleTypes.MODEL:
          if (chatA.settings.model && chatB.settings.model) {
            await getCompletion(chatA);
            await getCompletion(chatB);
          } else {
            console.error(
              "chatA.settings.model or chatB.settings.model is null"
            );
          }
          break;
      }
    }
  };

  return (
    <Paper shadow="xs" radius={5} withBorder p="xl" mt="20">
      <Grid>
        <Grid.Col span={6}>
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <ChatColumn chat={chatA} />
            <Button
              variant="outline"
              onClick={() =>
                setChatA((prevChatA) => ({ ...prevChatA, isWinner: true }))
              }
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
            <ChatColumn chat={chatB} />
            <Button
              variant="outline"
              onClick={() =>
                setChatB((prevChatB) => ({ ...prevChatB, isWinner: true }))
              }
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
          disabled={
            chatA.botTyping ||
            chatB.botTyping ||
            chatA.isWinner ||
            chatB.isWinner
          }
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
