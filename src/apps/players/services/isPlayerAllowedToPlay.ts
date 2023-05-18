import { PlayerDbRecord } from '../../../models/DbRecords';
import { PostPlayerCardInput } from '../../../models/players';

export const isPlayerAllowedToPlay = async (input: PostPlayerCardInput, players: PlayerDbRecord[]): Promise<boolean> => {
  const currentPlayer : PlayerDbRecord = players.find((player) => player.id === input.playerId) as PlayerDbRecord;

  // Verify player order
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

  // verify if player is skipping his turn
  if (input.cardId === 'skip') {
    return true;
  }

  // verify if player has the card in his hand
  if (!currentPlayer.handCards.includes(input.cardId)) {
    return false;
  }

  // verify if player has enough mana
  if (Number(input.cardId) < currentPlayer.mana) {
    return false;
  }

  // verify if player has enough health points
  if (currentPlayer.healthPoints <= 0) {
    return false;
  }

  return true;
};
