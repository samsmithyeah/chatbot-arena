import React, { useState, useEffect } from "react";
import { Select, Textarea } from "@mantine/core";
import { BattleTypes, ChatMessage, Prompt } from "../pages/index";
import { UUID } from "crypto";

interface SettingsProps {
  battleType: BattleTypes;
  modelAUserInput: string | undefined;
  modelBUserInput: string | undefined;
  setModelAUserInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  setModelBUserInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  promptAUserInput: Prompt;
  promptBUserInput: Prompt;
  setPromptAUserInput: React.Dispatch<React.SetStateAction<Prompt>>;
  setPromptBUserInput: React.Dispatch<React.SetStateAction<Prompt>>;
  chatStarted: boolean;
  models: string[] | undefined;
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
    models,
  } = props;

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
            data={models}
            value={modelAUserInput}
            onChange={(value) => setModelAUserInput(value as string)}
            disabled={chatStarted}
          />
          <Select
            label="Model B"
            placeholder="Select Model B"
            data={models}
            value={modelBUserInput}
            onChange={(value) => setModelBUserInput(value as string)}
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
            data={models}
            value={modelAUserInput}
            onChange={(value) => setModelAUserInput(value as string)}
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
