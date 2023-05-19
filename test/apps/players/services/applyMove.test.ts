import { applyMove } from '../../../../src/apps/players/services/applyMove';
import { GameRepository } from '../../../../src/helpers/repositories/GameRepository';
import { PlayerRepository } from '../../../../src/helpers/repositories/PlayerRepository';
import { GameDbRecord, PlayerDbRecord } from '../../../../src/models/DbRecords';
import * as playNextTurnService from '../../../../src/apps/players/services/playNextTurn';

describe('Apply Move Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('applyMove', () => {
    let updateOneSpy: jest.SpyInstance;
    let createManySpy: jest.SpyInstance;
    let playNextTurnSpy: jest.SpyInstance;

    beforeAll(() => {
      updateOneSpy = jest.spyOn(GameRepository, 'updateOne');
      updateOneSpy.mockResolvedValue(undefined);
      createManySpy = jest.spyOn(PlayerRepository, 'createMany');
      createManySpy.mockResolvedValue(undefined);
      playNextTurnSpy = jest.spyOn(playNextTurnService, 'playNextTurn');
      playNextTurnSpy.mockReturnValue(undefined);
    });

    it('should update game and create players', async () => {
      const input = {
        playerId: 'player1Id',
        gameId: 'gameId',
        cardId: '1',
      };

      const game : GameDbRecord = {
        id: 'gameId',
        turnNumber: 0,
        isFinished: false,
      };

      const beforePlayer1 : PlayerDbRecord = {
        id: 'player1Id',
        name: 'player1',
        playOrder: 2,
        turnNumber: 0,
        isPlaying: true,
        handCards: ['1'],
        healthPoints: 30,
        mana: 1,
        hiddenCards: [],
        _gameId: 'gameId',
      } as PlayerDbRecord;

      const beforePlayer2 : PlayerDbRecord = {
        id: 'player2Id',
        name: 'player2',
        playOrder: 1,
        turnNumber: 1,
        isPlaying: true,
        healthPoints: 30,
        mana: 0,
        handCards: [],
        hiddenCards: ['1'],
        _gameId: 'gameId',
      };

      const afterPlayer1 : PlayerDbRecord = {
        id: 'player1Id',
        name: 'player1',
        playOrder: 2,
        turnNumber: 0,
        isPlaying: true,
        handCards: [],
        healthPoints: 30,
        mana: 0,
        hiddenCards: [],
        _gameId: 'gameId',
      } as PlayerDbRecord;

      const afterPlayer2 : PlayerDbRecord = {
        id: 'player2Id',
        name: 'player2',
        playOrder: 1,
        turnNumber: 1,
        isPlaying: true,
        healthPoints: 29,
        mana: 0,
        handCards: [],
        hiddenCards: ['1'],
        _gameId: 'gameId',
      } as PlayerDbRecord;

      const beforePlayers = [beforePlayer1, beforePlayer2];
      const afterPlayers = [afterPlayer1, afterPlayer2];

      await applyMove(input, beforePlayers, game);

      expect(updateOneSpy).toHaveBeenCalledTimes(1);
      expect(updateOneSpy).toHaveBeenCalledWith(game);
      expect(createManySpy).toHaveBeenCalledTimes(1);
      expect(createManySpy).toHaveBeenCalledWith(afterPlayers);
    });
  });
});
