import { CreateGameInput } from '../../../models/games';
import { GameDbRecord } from '../../../models/DbRecords';
import { randomUUID } from 'crypto';

export const createGame = async (input: CreateGameInput): Promise<string> => {
  const game : GameDbRecord = {
    id: randomUUID(),
    turnNumber: 0,
    isFinished: false,
  };

  return game.id;
};
