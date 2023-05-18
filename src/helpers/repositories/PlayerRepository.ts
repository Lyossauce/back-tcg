import { BatchWriteItemCommand, BatchWriteItemInput } from '@aws-sdk/client-dynamodb';
import { PlayerDbRecord } from '../../models/DbRecords';
import { marshall } from '@aws-sdk/util-dynamodb';
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
};
