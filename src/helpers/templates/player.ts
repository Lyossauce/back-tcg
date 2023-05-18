import { PlayerDbRecord } from '../../models/DbRecords';

export const NEW_PLAYER : Partial<PlayerDbRecord> = {
  healthPoints: 30,
  mana: 0,
  handCards: [],
  hiddenCards: ['0', '0', '1', '1', '2', '2', '2', '3', '3', '3', '3', '4', '4', '4', '5', '5', '6', '6', '7', '8'],
  turnNumber: 0,
};
