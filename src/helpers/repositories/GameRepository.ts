import { PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { GameDbRecord } from '../../models/DbRecords';
import { marshall } from '@aws-sdk/util-dynamodb';
import { getClient } from './dynamodbHelper';


export const GameRepository = {

  /**
 * @name createOne
 * @description Create entry in Game table
 * @param {GameDbRecord} record
 *
 */
  createOne: async (record: GameDbRecord) => {
    const param : PutItemCommandInput = {
      TableName: process.env.gamesTableName,
      Item: marshall(record),
    };

    await getClient().send(new PutItemCommand(param));
  },
};
