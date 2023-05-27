import * as playNextTurnService from '../../../../src/apps/players/services/playNextTurn';
import { createGame } from '../../../../src/apps/games/services/createGame';
import { GameRepository } from '../../../../src/helpers/repositories/GameRepository';
import { PlayerRepository } from '../../../../src/helpers/repositories/PlayerRepository';
import { NEW_PLAYER } from '../../../../src/helpers/templates/player';

describe('Create Game', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createGameInput = {
    player1Name: 'player1',
    player2Name: 'player2',
  };

  describe('createGame', () => {
    let createOneSpy: jest.SpyInstance;
    let createManySpy: jest.SpyInstance;

    beforeAll(() => {
      createOneSpy = jest.spyOn(GameRepository, 'createOne');
      createManySpy = jest.spyOn(PlayerRepository, 'createMany');
    });

    it('should create game and players', async () => {
      const game = {
        id: expect.any(String),
        turnNumber: 0,
        isFinished: false,
      };

      const player1 = {
        id: expect.any(String),
        _gameId: game.id,
        name: createGameInput.player1Name,
        playOrder: 1,
        ...NEW_PLAYER,
        mana: 1,
        isPlaying: true,
      };

      const player2 = {
        id: expect.any(String),
        _gameId: game.id,
        name: createGameInput.player2Name,
        playOrder: 2,
        ...NEW_PLAYER,
        isPlaying: false,
      };

      createOneSpy.mockResolvedValue(game);
      createManySpy.mockResolvedValue([player1, player2]);

      const response = await createGame(createGameInput);

      expect(response).toEqual(game.id);
      expect(createOneSpy).toHaveBeenCalledTimes(1);
      expect(createOneSpy).toHaveBeenCalledWith(game);
      expect(createManySpy).toHaveBeenCalledTimes(1);
      expect(createManySpy).toHaveBeenCalledWith([player1, player2]);
    });
  });
});
