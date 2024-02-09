import React from "react";
import { Select, Textarea } from "@mantine/core";
import { BattleTypes, Models, ChatMessage, Prompt } from "../pages/index";

interface SettingsProps {
  battleType: BattleTypes;
  modelAUserInput: Models;
  modelBUserInput: Models;
  setModelAUserInput: React.Dispatch<React.SetStateAction<Models>>;
  setModelBUserInput: React.Dispatch<React.SetStateAction<Models>>;
  promptAUserInput: Prompt;
  promptBUserInput: Prompt;
  setPromptAUserInput: React.Dispatch<React.SetStateAction<Prompt>>;
  setPromptBUserInput: React.Dispatch<React.SetStateAction<Prompt>>;
  chatStarted: boolean;
}

const Settings = (props: SettingsProps) => {
  const {
    battleType,
    modelAUserInput,
    modelBUserInput,
    setModelAUserInput,
    setModelBUserInput,
    promptAUserInput,
    promptBUserInput,
    setPromptAUserInput,
    setPromptBUserInput,
    chatStarted,
  } = props;

  const modelOptions = Object.values(Models);

  const handlePromptAChange = (newPrompt: string) => {
    setPromptAUserInput({ ...promptAUserInput, content: newPrompt });
  };

  const handlePromptBChange = (newPrompt: string) => {
    setPromptBUserInput({ ...promptBUserInput, content: newPrompt });
  };

  return (
    <div>
      {battleType === BattleTypes.MODEL && (
        <>
          <Select
            label="Model A"
            placeholder="Select Model A"
            data={modelOptions}
            value={modelAUserInput}
            onChange={() => setModelAUserInput}
            disabled={chatStarted}
          />
          <Select
            label="Model B"
            placeholder="Select Model B"
            data={modelOptions}
            value={modelBUserInput}
            onChange={() => setModelBUserInput}
            disabled={chatStarted}
          />
          <Textarea
            label="Prompt"
            placeholder="Enter your prompt"
            value={promptAUserInput.content}
            onChange={(event) => handlePromptAChange(event.currentTarget.value)}
            minRows={5}
            maxRows={15}
            autosize
            disabled={chatStarted}
          />
        </>
      )}

      {battleType === BattleTypes.PROMPT && (
        <>
          <Select
            label="Model"
            placeholder="Select a model"
            data={modelOptions}
            value={modelAUserInput}
            onChange={() => setModelAUserInput}
          />
          <Textarea
            label="Prompt A"
            placeholder="Enter Prompt A"
            value={promptAUserInput.content}
            onChange={(event) => handlePromptAChange(event.currentTarget.value)}
            minRows={5}
            maxRows={15}
            autosize
          />
          <Textarea
            label="Prompt B"
            placeholder="Enter Prompt B"
            value={promptBUserInput.content}
            onChange={(event) => handlePromptBChange(event.currentTarget.value)}
            minRows={5}
            maxRows={15}
            autosize
          />
        </>
      )}
    </div>
  );
};

export default Settings;
