import React, { useState, useEffect } from "react";
import { Group, Title, Select, Grid } from "@mantine/core";
import { useRouter } from "next/router";
import Battle from "@/components/battle";
import Settings from "@/components/settings";
import Winner from "@/components/winner";
import { UUID } from "crypto";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export enum BattleTypes {
  PROMPT = "Prompt",
  MODEL = "Model",
}

export enum ChatNames {
  CHAT_A = "Chat A",
  CHAT_B = "Chat B",
}

export enum HardCodedModels {
  GPT3_5 = "gpt-3.5-turbo",
  GPT4 = "gpt-4",
}

interface Model {
  id: UUID;
  provider: string;
  tokenLimit: number;
  type: string;
  serviceModelId: string;
}
export interface Prompt {
  name: string;
  content: string;
}

export interface ChatSettings {
  model: string | undefined;
  prompt: Prompt | undefined;
}

export interface Chat {
  name: ChatNames;
  messages: ChatMessage[];
  settings: ChatSettings;
  botTyping: boolean;
  isWinner: boolean;
}

const promptADefault: Prompt = {
  name: "Prompt A",
  content:
    "Your task is to pretend to be a very rude, unhelpful AI assistant, created for a joke. Start the chat by asking the user for their name. You don't need to prefix your messages with 'AI: ' or anything like that. Just the message.",
};
const promptBDefault: Prompt = {
  name: "Prompt B",
  content:
    "Your task is to pretend to be a very overly, almost annoyingly polite and apologetic AI assistant. Start the chat by asking the user for their name. You don't need to prefix your messages with 'AI: ' or anything like that. Just the message.",
};

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatA, setChatA] = useState<Chat>({
    name: ChatNames.CHAT_A,
    messages: [],
    settings: {
      model: undefined,
      prompt: undefined,
    },
    botTyping: false,
    isWinner: false,
  });
  const [chatB, setChatB] = useState<Chat>({
    name: ChatNames.CHAT_B,
    messages: [],
    settings: {
      model: undefined,
      prompt: undefined,
    },
    botTyping: false,
    isWinner: false,
  });
  const [modelAUserInput, setModelAUserInput] = useState<string | undefined>();
  const [modelBUserInput, setModelBUserInput] = useState<string | undefined>();
  const [promptAUserInput, setPromptAUserInput] =
    useState<Prompt>(promptADefault);
  const [promptBUserInput, setPromptBUserInput] =
    useState<Prompt>(promptBDefault);
  const [chatStarted, setChatStarted] = useState(false);
  const [promptServiceModels, setPromptServiceModels] = useState<
    string[] | undefined
  >(undefined);
  const router = useRouter();

  const initialBattleType =
    (router.query.battleType as BattleTypes) || BattleTypes.PROMPT;
  const [battleType, setBattleType] = useState<BattleTypes>(initialBattleType);

  const battleTypeOptions = Object.values(BattleTypes);

  const hardCodedModels = Object.values(HardCodedModels);

  useEffect(() => {
    const getModels = async () => {
      try {
        const response = await fetch("/api/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        const models = data.message;
        const modelNames = models.map((model: Model) => model.serviceModelId);
        setPromptServiceModels(modelNames);
      } catch (error) {
        console.error(
          "Error fetching models - is the prompt service running?",
          error
        );
      }
    };
    getModels();
  }, []);

  useEffect(() => {
    handleResetChats(battleType);
  }, [
    modelAUserInput,
    modelBUserInput,
    promptAUserInput,
    promptBUserInput,
    battleType,
  ]);

  useEffect(() => {
    const queryBattleType = router.query.battleType as BattleTypes;
    if (
      queryBattleType &&
      Object.values(BattleTypes).includes(queryBattleType)
    ) {
      setBattleType(queryBattleType);
    }
  }, [router.query.battleType]);

  useEffect(() => {
    if (
      (chatA.messages.length > 1 && chatB.messages.length > 1) ||
      chatA.botTyping ||
      chatB.botTyping
    ) {
      setChatStarted(true);
    } else {
      setChatStarted(false);
    }
  }, [chatA.messages, chatB.messages, chatA.botTyping, chatB.botTyping]);

  const handleResetChats = (battleType: BattleTypes) => {
    switch (battleType) {
      case BattleTypes.PROMPT:
        const chatAMessagesGetsPromptA = Math.random() < 0.5;
        setChatA((prevChatA) => ({
          ...prevChatA,
          settings: {
            model: modelAUserInput,
            prompt: chatAMessagesGetsPromptA
              ? promptAUserInput
              : promptBUserInput,
          },
          messages: [
            {
              role: "system",
              content: chatAMessagesGetsPromptA
                ? promptAUserInput.content
                : promptBUserInput.content,
            },
          ],
          isWinner: false,
        }));
        setChatB((prevChatB) => ({
          ...prevChatB,
          settings: {
            model: modelBUserInput,
            prompt: chatAMessagesGetsPromptA
              ? promptBUserInput
              : promptAUserInput,
          },
          messages: [
            {
              role: "system",
              content: chatAMessagesGetsPromptA
                ? promptBUserInput.content
                : promptAUserInput.content,
            },
          ],
          isWinner: false,
        }));
        break;
      case BattleTypes.MODEL:
        const chatAMessagesGetsModelA = Math.random() < 0.5;
        setChatA((prevChatA) => ({
          ...prevChatA,
          settings: {
            model: chatAMessagesGetsModelA ? modelAUserInput : modelBUserInput,
            prompt: promptAUserInput,
          },
          messages: [{ role: "system", content: promptAUserInput.content }],
          isWinner: false,
        }));
        setChatB((prevChatB) => ({
          ...prevChatB,
          settings: {
            model: chatAMessagesGetsModelA ? modelBUserInput : modelAUserInput,
            prompt: promptAUserInput,
          },
          messages: [{ role: "system", content: promptAUserInput.content }],
          isWinner: false,
        }));
        break;
    }
  };

  const handleBattleTypeChange = (value: string | null) => {
    if (value && Object.values(BattleTypes).includes(value as BattleTypes)) {
      router.push(`/?battleType=${value}`, undefined, { shallow: true });
    }
  };

  const getCompletion = async (chat: Chat) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: chat.messages,
        model: chat.settings.model,
      }),
    });
    const data = await response.json();
    const assistantResponse: ChatMessage = {
      role: "assistant",
      content: data.message,
    };
    switch (chat.name) {
      case ChatNames.CHAT_A:
        setChatA((prevChatA) => ({
          ...prevChatA,
          messages: [...prevChatA.messages, assistantResponse],
          botTyping: false,
        }));
        break;
      case ChatNames.CHAT_B:
        setChatB((prevChatB) => ({
          ...prevChatB,
          messages: [...prevChatB.messages, assistantResponse],
          botTyping: false,
        }));
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
            promptServiceModels={promptServiceModels}
            hardCodedModels={hardCodedModels}
          />
        </Grid.Col>
        <Grid.Col span={9}>
          <Battle
            getCompletion={getCompletion}
            chatStarted={chatStarted}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleResetChats={handleResetChats}
            battleType={battleType}
            chatA={chatA}
            chatB={chatB}
            setChatA={setChatA}
            setChatB={setChatB}
          ></Battle>
        </Grid.Col>
      </Grid>
      {(chatA.isWinner || chatB.isWinner) && (
        <Winner battleType={battleType} chatA={chatA} chatB={chatB} />
      )}
    </>
  );
};

export default HomePage;
