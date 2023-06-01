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
        healthPoints: 30,
        mana: 1,
        handCards: expect.any(Array),
        hiddenCards: expect.any(Array),
        turnNumber: 0,
        playOrder: 1,
        isPlaying: true,
      };

      const player2 = {
        id: expect.any(String),
        _gameId: game.id,
        name: createGameInput.player2Name,
        healthPoints: 30,
        mana: 0,
        handCards: [],
        hiddenCards: [...(NEW_PLAYER.hiddenCards as string[])],
        turnNumber: 0,
        playOrder: 2,
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
      expect(createManySpy.mock.calls[0][0][0].handCards.length).toEqual(1);
      expect(createManySpy.mock.calls[0][0][0].hiddenCards.length).toEqual(19);
    });
  });
});
