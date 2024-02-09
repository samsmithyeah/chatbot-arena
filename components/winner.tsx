import React from "react";
import { Text } from "@mantine/core";
import { BattleTypes, Chats, ChatSettings } from "../pages/index";

interface WinnerProps {
  battleType: BattleTypes;
  chatASettings: ChatSettings;
  chatBSettings: ChatSettings;
  winner: Chats | null;
}

const Winner = (props: WinnerProps) => {
  const { battleType, chatASettings, chatBSettings, winner } = props;

  return (
    <>
      {battleType === BattleTypes.MODEL && (
        <Text size="lg">
          Winner:{" "}
          {winner === Chats.CHAT_A ? chatASettings.model : chatBSettings.model}
        </Text>
      )}
      {battleType === BattleTypes.PROMPT && (
        <>
          <Text size="lg">
            Winner:{" "}
            {winner === Chats.CHAT_A
              ? chatASettings.prompt?.name
              : chatBSettings.prompt?.name}
          </Text>
          <Text size="sm">
            {winner === Chats.CHAT_A
              ? chatASettings.prompt?.content
              : chatBSettings.prompt?.content}
          </Text>
        </>
      )}
    </>
  );
};

export default Winner;
