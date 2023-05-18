import { GameDbRecord, PlayerDbRecord } from '../../../models/DbRecords';
import { CreateGameInput } from '../../../models/games';
import { GameRepository } from '../../../helpers/repositories/GameRepository';
import { NEW_PLAYER } from '../../../helpers/templates/player';
import { PlayerRepository } from '../../../helpers/repositories/PlayerRepository';
import { randomUUID } from 'crypto';
import { playNextTurn } from '../../players/services/playNextTurn';

/**
 * @name gameValidator
 * @description Create the game and the players and return the game id
 * @param {CreateGameInput} input
 *
 * @returns {string}
 */
export const createGame = async (input: CreateGameInput): Promise<string> => {
  const game : GameDbRecord = {
    id: randomUUID(),
    turnNumber: 0,
    isFinished: false,
  };

  const player1 : PlayerDbRecord = {
    id: randomUUID(),
    _gameId: game.id,
    name: input.player1Name,
    ...NEW_PLAYER,
    playOrder: 1,
  } as PlayerDbRecord;

  const player2 : PlayerDbRecord = {
    id: randomUUID(),
    _gameId: game.id,
    name: input.player2Name,
    ...NEW_PLAYER,
    playOrder: 2,
  } as PlayerDbRecord;

  const players = [player1, player2];

  await playNextTurn(player2.id, players, game);

  await GameRepository.createOne(game);

  await PlayerRepository.createMany(players);

  return game.id;
};
