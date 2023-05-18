import { PlayerDbRecord } from '../../../models/DbRecords';
import { PostPlayerCardInput } from '../../../models/players';

export const isPlayerAllowedToPlay = async (input: PostPlayerCardInput, players: PlayerDbRecord[]): Promise<boolean> => {
  const currentPlayer : PlayerDbRecord = players.find((player) => player.id === input.playerId) as PlayerDbRecord;

  for (const player of players) {
    if (player.id === input.playerId) {
      continue;
    }
    if ((
      player.playOrder < currentPlayer.playOrder &&
            player.turnNumber === currentPlayer.turnNumber
    ) || (
      player.playOrder > currentPlayer.playOrder &&
            player.turnNumber !== currentPlayer.turnNumber
    )) {
      return false;
    }
  }

  if (input.cardId === 'skip') {
    return true;
  }

  if (!currentPlayer.handCards.includes(input.cardId)) {
    return false;
  }

  if (Number(input.cardId) < currentPlayer.mana) {
    return false;
  }

  if (currentPlayer.healthPoints <= 0) {
    return false;
  }

  return true;
};
