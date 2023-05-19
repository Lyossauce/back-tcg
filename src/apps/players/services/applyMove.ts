import { GameDbRecord, PlayerDbRecord } from '../../../models/DbRecords';
import { GameRepository } from '../../../helpers/repositories/GameRepository';
import { PlayerRepository } from '../../../helpers/repositories/PlayerRepository';
import { playNextTurn } from './playNextTurn';
import { PostPlayerCardInput } from '../../../models/players';

export const applyMove = async (input: PostPlayerCardInput, players: PlayerDbRecord[], game: GameDbRecord) => {
  const nextPlayer = input.cardId === 'skip';

  const currentPlayer : PlayerDbRecord = players.find((player) => player.id === input.playerId) as PlayerDbRecord;
  if (!nextPlayer) {
    const enemyPlayer : PlayerDbRecord = players.find((player) => player.id !== input.playerId) as PlayerDbRecord;

    // Apply card effect
    const cardIndex = currentPlayer.handCards.indexOf(input.cardId);
    currentPlayer.handCards.splice(cardIndex, 1);
    currentPlayer.mana -= Number(input.cardId);
    enemyPlayer.healthPoints -= Number(input.cardId);
  }


  if (nextPlayer || currentPlayer.handCards.length === 0) {
    await playNextTurn(input.playerId, players, game);

    await GameRepository.updateOne(game);
  }

  await PlayerRepository.createMany(players);
};
