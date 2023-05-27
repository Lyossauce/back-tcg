import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GameDbRecord } from '../../../src/models/DbRecords';
import { GameRepository } from '../../../src/helpers/repositories/GameRepository';
import { mockClient } from 'aws-sdk-client-mock';
import { marshall } from '@aws-sdk/util-dynamodb';

// @ts-ignore
const dbMock = mockClient(DynamoDBClient);

describe('Game Repository', () => {

  const game : GameDbRecord = {
    id: 'id',
    turnNumber: 0,
    isFinished: false,
  };


  afterEach(() => {
    jest.clearAllMocks();
    dbMock.reset();
  });

  describe('createOne', () => {
    it('should create one game', async () => {

      dbMock.resolves({});

      const expectedCommand = {
        TableName: process.env.gamesTableName,
        Item: {
          id: { S: game.id },
          turnNumber: { N: game.turnNumber.toString() },
          isFinished: { BOOL: game.isFinished },
        },
      };

      await GameRepository.createOne(game);

      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

  });

  describe('getOne', () => {
    it('should get one game', async () => {

      dbMock.resolves({ Item: marshall(game) });

      const expectedCommand = {
        TableName: process.env.gamesTableName,
        Key: {
          id: { S: 'id' },
        },
      };

      const result = await GameRepository.getOne('id');

      expect(result).toStrictEqual(game);
      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

    it('should get no game', async () => {

      dbMock.resolves({ Item: undefined });

      const expectedCommand = {
        TableName: process.env.gamesTableName,
        Key: {
          id: { S: 'id' },
        },
      };

      const result = await GameRepository.getOne('id');

      expect(result).toBeUndefined();
      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

  });

  describe('updateOne', () => {
    it('should get one game', async () => {

      dbMock.resolves({ });

      const expectedCommand = {
        TableName: process.env.gamesTableName,
        Item: {
          id: { S: game.id },
          turnNumber: { N: game.turnNumber.toString() },
          isFinished: { BOOL: game.isFinished },
        },
      };

      await GameRepository.updateOne(game);

      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

  });
});
