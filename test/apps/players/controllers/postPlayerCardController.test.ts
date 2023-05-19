import { APIGatewayProxyEvent } from 'aws-lambda';
import * as postPlayerCardController from '../../../../src/apps/players/controllers/postPlayerCardController';
import * as isPlayerAllowedToPlayService from '../../../../src/apps/players/services/isPlayerAllowedToPlay';
import * as applyMoveService from '../../../../src/apps/players/services/applyMove';
import { PlayerRepository } from '../../../../src/helpers/repositories/PlayerRepository';
import { GameRepository } from '../../../../src/helpers/repositories/GameRepository';
import { GameDbRecord, PlayerDbRecord } from '../../../../src/models/DbRecords';

describe('Post Player Card Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  let request: APIGatewayProxyEvent;

  const postPlayerCardInput = {
    cardId: 'cardId',
    playerId: 'playerId',
    gameId: 'gameId',
  };

  const players: PlayerDbRecord[] = [{
    '_gameId': 'gameId',
    'mana': 0,
    'healthPoints': 30,
    'name': 'player2',
    'hiddenCards': [
      '0',
      '0',
      '1',
      '1',
      '2',
      '2',
      '2',
      '3',
      '3',
      '3',
      '3',
      '4',
      '4',
      '4',
      '5',
      '5',
      '6',
      '6',
      '7',
      '8',
    ],
    'turnNumber': 0,
    'id': 'playerId',
    'handCards': [],
    'playOrder': 2,
    'isPlaying': true,
  }];

  const game = {} as GameDbRecord;

  describe('postPlayerCardController', () => {
    let playerCardValidatorSpy: jest.SpyInstance;
    let getByGameIdSpy: jest.SpyInstance;
    let getOneSpy: jest.SpyInstance;
    let isPlayerAllowedToPlaySpy: jest.SpyInstance;
    let applyMoveSpy: jest.SpyInstance;

    request = {
      pathParameters: {
        gameId: 'gameId',
        playerId: 'playerId',
      },
      body: JSON.stringify({ cardid: 'cardId' }),
    } as unknown as APIGatewayProxyEvent;

    beforeAll(() => {
      playerCardValidatorSpy = jest.spyOn(postPlayerCardController, 'playerCardValidator');
      getByGameIdSpy = jest.spyOn(PlayerRepository, 'getByGameId');
      getOneSpy = jest.spyOn(GameRepository, 'getOne');
      isPlayerAllowedToPlaySpy = jest.spyOn(isPlayerAllowedToPlayService, 'isPlayerAllowedToPlay');
      applyMoveSpy = jest.spyOn(applyMoveService, 'applyMove');
      applyMoveSpy.mockResolvedValue(undefined);
    });

    afterAll(() => {
      playerCardValidatorSpy.mockRestore();
    });

    it('should return 200 with card id', async () => {
      playerCardValidatorSpy.mockResolvedValue(postPlayerCardInput);
      getByGameIdSpy.mockResolvedValue(players);
      getOneSpy.mockResolvedValue(game);
      isPlayerAllowedToPlaySpy.mockReturnValue(true);

      const expectedOutput = {
        statusCode: 200,
        body: JSON.stringify({ id: 'cardId' }),
      };

      const response = await postPlayerCardController.postPlayerCardController(request);

      expect(response).toEqual(expectedOutput);
      expect(playerCardValidatorSpy).toHaveBeenCalledTimes(1);
      expect(playerCardValidatorSpy).toHaveBeenCalledWith(request);
      expect(getByGameIdSpy).toHaveBeenCalledTimes(1);
      expect(getByGameIdSpy).toHaveBeenCalledWith('gameId');
      expect(getOneSpy).toHaveBeenCalledTimes(1);
      expect(getOneSpy).toHaveBeenCalledWith('gameId');
      expect(isPlayerAllowedToPlaySpy).toHaveBeenCalledTimes(1);
      expect(isPlayerAllowedToPlaySpy).toHaveBeenCalledWith(postPlayerCardInput, players);
      expect(applyMoveSpy).toHaveBeenCalledTimes(1);
      expect(applyMoveSpy).toHaveBeenCalledWith(postPlayerCardInput, players, game);
    });

    it('should return 400 when validator throw and error', async () => {
      playerCardValidatorSpy.mockRejectedValue(new Error('error'));

      const expectedOutput = {
        statusCode: 400,
        body: JSON.stringify({ message: 'error' }),
      };

      const response = await postPlayerCardController.postPlayerCardController(request);

      expect(response).toEqual(expectedOutput);
      expect(playerCardValidatorSpy).toHaveBeenCalledTimes(1);
      expect(playerCardValidatorSpy).toHaveBeenCalledWith(request);
      expect(getByGameIdSpy).toHaveBeenCalledTimes(0);
      expect(getOneSpy).toHaveBeenCalledTimes(0);
      expect(isPlayerAllowedToPlaySpy).toHaveBeenCalledTimes(0);
      expect(applyMoveSpy).toHaveBeenCalledTimes(0);
    });

    it('should return 404 error when no players are found', async () => {
      playerCardValidatorSpy.mockResolvedValue(postPlayerCardInput);
      getByGameIdSpy.mockResolvedValue([]);

      const expectedOutput = {
        statusCode: 404,
        body: JSON.stringify({ message: 'No players found' }),
      };

      const response = await postPlayerCardController.postPlayerCardController(request);

      expect(response).toEqual(expectedOutput);
      expect(playerCardValidatorSpy).toHaveBeenCalledTimes(1);
      expect(playerCardValidatorSpy).toHaveBeenCalledWith(request);
      expect(getByGameIdSpy).toHaveBeenCalledTimes(1);
      expect(getByGameIdSpy).toHaveBeenCalledWith('gameId');
      expect(getOneSpy).toHaveBeenCalledTimes(0);
      expect(isPlayerAllowedToPlaySpy).toHaveBeenCalledTimes(0);
      expect(applyMoveSpy).toHaveBeenCalledTimes(0);
    });

    it('should return 404 error when no games are found', async () => {
      playerCardValidatorSpy.mockResolvedValue(postPlayerCardInput);
      getByGameIdSpy.mockResolvedValue(players);
      getOneSpy.mockResolvedValue(undefined);

      const expectedOutput = {
        statusCode: 404,
        body: JSON.stringify({ message: 'No game found' }),
      };

      const response = await postPlayerCardController.postPlayerCardController(request);

      expect(response).toEqual(expectedOutput);
      expect(playerCardValidatorSpy).toHaveBeenCalledTimes(1);
      expect(playerCardValidatorSpy).toHaveBeenCalledWith(request);
      expect(getByGameIdSpy).toHaveBeenCalledTimes(1);
      expect(getByGameIdSpy).toHaveBeenCalledWith('gameId');
      expect(getOneSpy).toHaveBeenCalledTimes(1);
      expect(getOneSpy).toHaveBeenCalledWith('gameId');
      expect(isPlayerAllowedToPlaySpy).toHaveBeenCalledTimes(0);
      expect(applyMoveSpy).toHaveBeenCalledTimes(0);
    });

    it('should return 409 error when the player cannot play this move', async () => {
      playerCardValidatorSpy.mockResolvedValue(postPlayerCardInput);
      getByGameIdSpy.mockResolvedValue(players);
      getOneSpy.mockResolvedValue(game);
      isPlayerAllowedToPlaySpy.mockReturnValue(false);

      const expectedOutput = {
        statusCode: 409,
        body: JSON.stringify({ message: 'The player is not allowed to play this move' }),
      };

      const response = await postPlayerCardController.postPlayerCardController(request);

      expect(response).toEqual(expectedOutput);
      expect(playerCardValidatorSpy).toHaveBeenCalledTimes(1);
      expect(playerCardValidatorSpy).toHaveBeenCalledWith(request);
      expect(getByGameIdSpy).toHaveBeenCalledTimes(1);
      expect(getByGameIdSpy).toHaveBeenCalledWith('gameId');
      expect(getOneSpy).toHaveBeenCalledTimes(1);
      expect(getOneSpy).toHaveBeenCalledWith('gameId');
      expect(isPlayerAllowedToPlaySpy).toHaveBeenCalledTimes(1);
      expect(isPlayerAllowedToPlaySpy).toHaveBeenCalledWith(postPlayerCardInput, players);
      expect(applyMoveSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('playerCardValidator', () => {
    it('should return input when input is valid', async () => {
      request = {
        pathParameters: {
          gameId: 'gameId',
          playerId: 'playerId',
        },
        body: JSON.stringify({ cardId: 'cardId' }),
      } as unknown as APIGatewayProxyEvent;

      const expectedOutput = postPlayerCardInput;

      const response = await postPlayerCardController.playerCardValidator(request);

      expect(response).toEqual(expectedOutput);
    });

    it('should throw error when request body is missing', async () => {
      request = {} as APIGatewayProxyEvent;

      const expectedError = new Error('Missing body');

      await expect(async () => {
        await postPlayerCardController.playerCardValidator(request);
      }).rejects.toThrow(expectedError);
    });

    it('should throw error when input is invalid', async () => {
      request = {
        body: JSON.stringify({}),
      } as APIGatewayProxyEvent;

      const expectedError = new Error('"cardId" is required');

      await expect(async () => {
        await postPlayerCardController.playerCardValidator(request);
      }).rejects.toThrow(expectedError);
    });
  });
});
