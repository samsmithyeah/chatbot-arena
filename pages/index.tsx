import React, { useState, useEffect } from "react";
import { Group, Title, Select, Paper, Grid } from "@mantine/core";
import { useRouter } from "next/router";
import Battle from "@/components/battle";
import Settings from "@/components/settings";
import Winner from "@/components/winner";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export enum BattleTypes {
  PROMPT = "Prompt",
  MODEL = "Model",
}

export enum Chats {
  CHAT_A = "Chat A",
  CHAT_B = "Chat B",
}

export enum Models {
  GPT3_5 = "gpt-3.5-turbo",
  GPT4 = "gpt-4",
}

export interface Prompt {
  name: string;
  content: string;
}

export interface ChatSettings {
  model: Models | null;
  prompt: Prompt | null;
}

const promptADefault = {
  name: "Prompt A",
  content:
    "Your task is to pretend to be a very rude, unhelpful AI assistant, created for a joke. Start the chat by asking the user for their name. You don't need to prefix your messages with 'AI: ' or anything like that. Just the message.",
};
const promptBDefault = {
  name: "Prompt B",
  content:
    "Your task is to pretend to be a very overly, almost annoyingly polite and apologetic AI assistant. Start the chat by asking the user for their name. You don't need to prefix your messages with 'AI: ' or anything like that. Just the message.",
};

const HomePage = () => {
  const [chatAMessages, setChatAMessages] = useState<ChatMessage[]>([]);
  const [chatBMessages, setChatBMessages] = useState<ChatMessage[]>([]);
  const [chatASettings, setChatASettings] = useState<ChatSettings>({
    model: null,
    prompt: null,
  });
  const [chatBSettings, setChatBSettings] = useState<ChatSettings>({
    model: null,
    prompt: null,
  });
  const [isChatbotATyping, setIsChatbotATyping] = useState(false);
  const [isChatbotBTyping, setIsChatbotBTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [winner, setWinner] = useState<Chats | null>(null);
  const [modelAUserInput, setModelAUserInput] = useState<Models>(Models.GPT3_5);
  const [modelBUserInput, setModelBUserInput] = useState<Models>(Models.GPT4);
  const [promptAUserInput, setPromptAUserInput] =
    useState<Prompt>(promptADefault);
  const [promptBUserInput, setPromptBUserInput] =
    useState<Prompt>(promptBDefault);

  const router = useRouter();

  const chatStarted =
    (chatAMessages.length > 1 && chatBMessages.length > 1) ||
    isChatbotATyping ||
    isChatbotBTyping;

  const initialBattleType =
    (router.query.battleType as BattleTypes) || BattleTypes.PROMPT;
  const [battleType, setBattleType] = useState<BattleTypes>(initialBattleType);

  const battleTypeOptions = Object.values(BattleTypes);

  useEffect(() => {
    const queryBattleType = router.query.battleType as BattleTypes;
    if (
      queryBattleType &&
      Object.values(BattleTypes).includes(queryBattleType)
    ) {
      setBattleType(queryBattleType);
      handleResetChats(queryBattleType);
    }
  }, [router.query.battleType]);

  const handleResetChats = (battleType: BattleTypes) => {
    switch (battleType) {
      case BattleTypes.PROMPT:
        console.log("in prompt type reset");
        const chatAMessagesGetsPromptA = Math.random() < 0.5;
        console.log("chatAMessagesGetsPromptA", chatAMessagesGetsPromptA);
        setChatASettings({
          model: modelAUserInput,
          prompt: chatAMessagesGetsPromptA
            ? promptAUserInput
            : promptBUserInput,
        });
        setChatBSettings({
          model: modelAUserInput,
          prompt: chatAMessagesGetsPromptA
            ? promptBUserInput
            : promptAUserInput,
        });
        setChatAMessages([
          {
            role: "system",
            content: chatAMessagesGetsPromptA
              ? promptAUserInput.content
              : promptBUserInput.content,
          },
        ]);
        setChatBMessages([
          {
            role: "system",
            content: chatAMessagesGetsPromptA
              ? promptBUserInput.content
              : promptAUserInput.content,
          },
        ]);
        break;
      case BattleTypes.MODEL:
        console.log("in model type reset");
        const chatAMessagesGetsModelA = Math.random() < 0.5;
        console.log("chatAMessagesGetsModelA", chatAMessagesGetsModelA);
        setChatASettings({
          model: chatAMessagesGetsModelA ? modelAUserInput : modelBUserInput,
          prompt: promptAUserInput,
        });
        setChatBSettings({
          model: chatAMessagesGetsModelA ? modelBUserInput : modelAUserInput,
          prompt: promptAUserInput,
        });
        setChatAMessages([
          { role: "system", content: promptAUserInput.content },
        ]);
        setChatBMessages([
          { role: "system", content: promptAUserInput.content },
        ]);
        break;
    }
    setWinner(null);
    console.log("reset chats");
  };

  const handleBattleTypeChange = (value: string | null) => {
    if (value && Object.values(BattleTypes).includes(value as BattleTypes)) {
      router.push(`/?battleType=${value}`, undefined, { shallow: true });
    }
  };

  const getCompletion = async (
    messages: ChatMessage[],
    chat: Chats,
    model: Models
  ) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, model }),
    });
    const data = await response.json();
    const assistantResponse: ChatMessage = {
      role: "assistant",
      content: data.message,
    };
    switch (chat) {
      case Chats.CHAT_A:
        setChatAMessages((prevChat) => [...prevChat, assistantResponse]);
        setIsChatbotATyping(false);
        break;
      case Chats.CHAT_B:
        setChatBMessages((prevChat) => [...prevChat, assistantResponse]);
        setIsChatbotBTyping(false);
        break;
    }
  };

  return (
    <>
      <Group>
        <Title order={1}>Chatbot battle:</Title>
        <Select
          size="lg"
          allowDeselect={false}
          value={battleType}
          data={battleTypeOptions}
          onChange={handleBattleTypeChange}
        />
      </Group>
      <Grid>
        <Grid.Col span={3}>
          <Settings
            battleType={battleType}
            modelAUserInput={modelAUserInput}
            modelBUserInput={modelBUserInput}
            setModelAUserInput={setModelAUserInput}
            setModelBUserInput={setModelBUserInput}
            promptAUserInput={promptAUserInput}
            setPromptAUserInput={setPromptAUserInput}
            promptBUserInput={promptBUserInput}
            setPromptBUserInput={setPromptBUserInput}
            chatStarted={chatStarted}
          />
        </Grid.Col>
        <Grid.Col span={9}>
          <Battle
            getCompletion={getCompletion}
            isChatbotATyping={isChatbotATyping}
            isChatbotBTyping={isChatbotBTyping}
            chatStarted={chatStarted}
            inputValue={inputValue}
            setInputValue={setInputValue}
            setChatAMessages={setChatAMessages}
            setChatBMessages={setChatBMessages}
            chatAMessages={chatAMessages}
            chatBMessages={chatBMessages}
            setIsChatbotATyping={setIsChatbotATyping}
            setIsChatbotBTyping={setIsChatbotBTyping}
            winner={winner}
            setWinner={setWinner}
            handleResetChats={handleResetChats}
            battleType={battleType}
            chatASettings={chatASettings}
            chatBSettings={chatBSettings}
          ></Battle>
        </Grid.Col>
      </Grid>
      {winner && (
        <Winner
          battleType={battleType}
          winner={winner}
          chatASettings={chatASettings}
          chatBSettings={chatBSettings}
        />
      )}
    </>
  );
};

export default HomePage;
