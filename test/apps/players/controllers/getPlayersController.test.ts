import { APIGatewayProxyEvent } from 'aws-lambda';
import * as createGameController from '../../../../src/apps/games/controllers/createGameController';
import { PlayerRepository } from '../../../../src/helpers/repositories/PlayerRepository';
import { PlayerDbRecord } from '../../../../src/models/DbRecords';
import { getPlayersController } from '../../../../src/apps/players/controllers/getPlayersController';

describe('Get Players Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  const request: APIGatewayProxyEvent = {
    pathParameters: {
      gameId: 'gameId',
    },
  } as unknown as APIGatewayProxyEvent;

  const players : PlayerDbRecord[] = [{
    '_gameId': 'a9608f02-22da-4b89-827b-aa6eab04302a',
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
    'id': '2f44b119-d992-4287-8ea6-950d9c9415a4',
    'handCards': [],
    'playOrder': 2,
    'isPlaying': true,
  }];

  describe('createGameController', () => {
    let getByGameSpy: jest.SpyInstance;

    beforeAll(() => {
      getByGameSpy = jest.spyOn(PlayerRepository, 'getByGameId');
    });

    it('should return 200 with players', async () => {
      getByGameSpy.mockResolvedValue(players);

      const response = await getPlayersController(request);

      expect(response.statusCode).toEqual(200);
      expect(JSON.parse(response.body).results).toEqual(players);
      expect(getByGameSpy).toHaveBeenCalledTimes(1);
      expect(getByGameSpy).toHaveBeenCalledWith('gameId');
    });

    it('should return 404 error when no players are found', async () => {
      const expectedOutput = {
        statusCode: 404,
        body: {
          message: 'No players found',
        },
      };

      getByGameSpy.mockResolvedValue([]);

      const response = await getPlayersController(request);

      expect(response.statusCode).toEqual(expectedOutput.statusCode);
      expect(JSON.parse(response.body)).toEqual(expectedOutput.body);
      expect(getByGameSpy).toHaveBeenCalledTimes(1);
      expect(getByGameSpy).toHaveBeenCalledWith('gameId');
    });
  });
});
