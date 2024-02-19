import React from "react";
import { Text } from "@mantine/core";
import { BattleTypes, Chat } from "../pages/index";

interface WinnerProps {
  battleType: BattleTypes;
  chatA: Chat;
  chatB: Chat;
}

const Winner = (props: WinnerProps) => {
  const { battleType, chatA, chatB } = props;

  return (
    <>
      {battleType === BattleTypes.MODEL && (
        <Text size="lg">
          Winner: {chatA.isWinner ? chatA.settings.model : chatB.settings.model}
        </Text>
      )}
      {battleType === BattleTypes.PROMPT && (
        <>
          <Text size="lg">
            Winner:{" "}
            {chatA.isWinner
              ? chatA.settings.prompt?.name
              : chatB.settings.prompt?.name}
          </Text>
          <Text size="sm">
            {chatA.isWinner
              ? chatA.settings.prompt?.content
              : chatB.settings.prompt?.content}
          </Text>
        </>
      )}
    </>
  );
};

export default Winner;
