import { BatchWriteItemCommand, BatchWriteItemInput, GetItemCommandInput, QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { PlayerDbRecord } from '../../models/DbRecords';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { getClient } from './dynamodbHelper';

const playersTableName = process.env.playersTableName as string;

export const PlayerRepository = {

  /**
   * @name createOne
   * @description Create entry in Game table
   * @param {GameDbRecord} record
   *
   */
  createMany: async (records: PlayerDbRecord[]) => {
    const param : BatchWriteItemInput = {
      RequestItems: {
        [playersTableName]: records.map((record) => {
          return {
            'PutRequest': {
              'Item': marshall(record),
            },
          };
        }),
      },
    };

    await getClient().send(new BatchWriteItemCommand(param));
  },

  getByGameId: async (gameId: string): Promise<PlayerDbRecord[]> => {
    const params : QueryCommandInput = {
      TableName: playersTableName,
      IndexName: 'gameIndex',
      KeyConditionExpression: '#gameId = :gameId',
      ExpressionAttributeNames: {
        '#gameId': '_gameId',
      },
      ExpressionAttributeValues: {
        ':gameId': { 'S': gameId },
      },
    };

    const result = await getClient().send(new QueryCommand(params));

    return result.Items ? result.Items.map(item => unmarshall(item)) as PlayerDbRecord[] : [];
  },
};
