import { PlayerDbRecord } from '../../../models/DbRecords';
import { PostPlayerCardInput } from '../../../models/players';

export const applyMove = async (input: PostPlayerCardInput, players: PlayerDbRecord[]) => {
  const nextPlayer = input.cardId === 'skip';
  const currentPlayer : PlayerDbRecord = players.find((player) => player.id === input.playerId) as PlayerDbRecord;
  const enemyPlayer : PlayerDbRecord = players.find((player) => player.id !== input.playerId) as PlayerDbRecord;

  const cardIndex = currentPlayer.handCards.indexOf(input.cardId);
  currentPlayer.handCards.splice(cardIndex, 1);
  currentPlayer.mana -= Number(input.cardId);
  enemyPlayer.healthPoints -= Number(input.cardId);

  if (nextPlayer) {
    await playNextTurn(input.playerId, players);
  }
};
