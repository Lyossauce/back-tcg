import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PlayerDbRecord } from '../../../src/models/DbRecords';
import { mockClient } from 'aws-sdk-client-mock';
import { marshall } from '@aws-sdk/util-dynamodb';
import { PlayerRepository } from '../../../src/helpers/repositories/PlayerRepository';

// @ts-ignore
const dbMock = mockClient(DynamoDBClient);

describe('Player repository', () => {

  const player : PlayerDbRecord = {
    id: 'id',
    turnNumber: 0,
    _gameId: 'gameId',
    name: 'name',
    healthPoints: 100,
    handCards: [],
    hiddenCards: [],
    mana: 0,
    playOrder: 0,
    isPlaying: false,
  };


  afterEach(() => {
    jest.clearAllMocks();
    dbMock.reset();
  });

  describe('createMany', () => {
    it('should create a list of players', async () => {

      dbMock.resolves({});

      const expectedCommand = {
        RequestItems: {
          [process.env.playersTableName as string]: [
            {
              PutRequest: {
                Item: {
                  id: { S: player.id },
                  turnNumber: { N: player.turnNumber.toString() },
                  _gameId: { S: player._gameId },
                  name: { S: player.name },
                  healthPoints: { N: player.healthPoints.toString() },
                  handCards: { L: [] },
                  hiddenCards: { L: [] },
                  mana: { N: player.mana.toString() },
                  playOrder: { N: player.playOrder.toString() },
                  isPlaying: { BOOL: player.isPlaying },
                },
              },
            },
          ],
        },
      };

      await PlayerRepository.createMany([player]);

      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

  });

  describe('getByGameId', () => {
    it('should get all players from a game', async () => {

      dbMock.resolves({ Items: [marshall(player)] });

      const expectedCommand = {
        TableName: process.env.playersTableName,
        IndexName: 'gameIndex',
        KeyConditionExpression: '#gameId = :gameId',
        ExpressionAttributeValues: {
          ':gameId': { S: 'id' },
        },
        ExpressionAttributeNames: {
          '#gameId': '_gameId',
        },
      };

      const result = await PlayerRepository.getByGameId('id');

      expect(result).toStrictEqual([player]);
      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

    it('should not return any players', async () => {

      dbMock.resolves({ });

      const expectedCommand = {
        TableName: process.env.playersTableName,
        IndexName: 'gameIndex',
        KeyConditionExpression: '#gameId = :gameId',
        ExpressionAttributeValues: {
          ':gameId': { S: 'id' },
        },
        ExpressionAttributeNames: {
          '#gameId': '_gameId',
        },
      };

      const result = await PlayerRepository.getByGameId('id');

      expect(result).toStrictEqual([]);
      expect(dbMock.calls()).toHaveLength(1);
      expect(dbMock.calls()[0].args[0].input).toStrictEqual(expectedCommand);
    });

  });
});
