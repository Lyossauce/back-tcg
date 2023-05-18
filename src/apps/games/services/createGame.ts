import { CreateGameInput } from '../../../models/games';
import { GameDbRecord } from '../../../models/DbRecords';
import { GameRepository } from '../../../helpers/repositories/GameRepository';
import { randomUUID } from 'crypto';

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

  await GameRepository.createOne(game);

  return game.id;
};
