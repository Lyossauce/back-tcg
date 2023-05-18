import { APIGatewayProxyEvent } from 'aws-lambda';
import * as createGameController from '../../../../src/apps/games/controllers/createGameController';
import * as createGameService from '../../../../src/apps/games/services/createGame';

describe('Create Game Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  let request: APIGatewayProxyEvent;

  const createGameInput = {
    player1Name: 'player1',
    player2Name: 'player2',
  };

  describe('createGameController', () => {
    let gameValidatorSpy: jest.SpyInstance;
    let createGameSpy: jest.SpyInstance;

    beforeAll(() => {
      gameValidatorSpy = jest.spyOn(createGameController, 'gameValidator');
      createGameSpy = jest.spyOn(createGameService, 'createGame');
    });

    afterAll(() => {
      gameValidatorSpy.mockRestore();
    });

    it('should return 200 with game id', async () => {
      request = {
        body: JSON.stringify(createGameInput),
      } as APIGatewayProxyEvent;

      const expectedOutput = {
        statusCode: 200,
        body: {
          id: 'gameId',
        },
      };

      gameValidatorSpy.mockResolvedValue(createGameInput);
      createGameSpy.mockResolvedValue('gameId');

      const response = await createGameController.createGameController(request);

      expect(response.statusCode).toEqual(expectedOutput.statusCode);
      expect(JSON.parse(response.body)).toEqual(expectedOutput.body);
      expect(gameValidatorSpy).toHaveBeenCalledTimes(1);
      expect(gameValidatorSpy).toHaveBeenCalledWith(request);
      expect(createGameSpy).toHaveBeenCalledTimes(1);
      expect(createGameSpy).toHaveBeenCalledWith(createGameInput);
    });

    it('should return 400 error when gameValidator throw error', async () => {
      request = {
        body: JSON.stringify(createGameInput),
      } as APIGatewayProxyEvent;

      const error = new Error('error message');

      const expectedOutput = {
        statusCode: 400,
        body: {
          message: 'error message',
        },
      };

      gameValidatorSpy.mockRejectedValue(error);

      const response = await createGameController.createGameController(request);

      expect(response.statusCode).toEqual(expectedOutput.statusCode);
      expect(JSON.parse(response.body)).toEqual(expectedOutput.body);
      expect(gameValidatorSpy).toHaveBeenCalledTimes(1);
      expect(gameValidatorSpy).toHaveBeenCalledWith(request);
      expect(createGameSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('gameValidator', () => {
    it('should return input when input is valid', async () => {
      request = {
        body: JSON.stringify(createGameInput),
      } as APIGatewayProxyEvent;

      const expectedOutput = createGameInput;

      const response = await createGameController.gameValidator(request);

      expect(response).toEqual(expectedOutput);
    });

    it('should throw error when request body is missing', async () => {
      request = {} as APIGatewayProxyEvent;

      const expectedError = new Error('Missing body');

      await expect(async () => {
        await createGameController.gameValidator(request);
      }).rejects.toThrow(expectedError);
    });

    it('should throw error when input is invalid', async () => {
      request = {
        body: JSON.stringify({}),
      } as APIGatewayProxyEvent;

      const expectedError = new Error('"player1Name" is required');

      await expect(async () => {
        await createGameController.gameValidator(request);
      }).rejects.toThrow(expectedError);
    });
  });
});
