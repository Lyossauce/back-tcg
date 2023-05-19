import { GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { GameDbRecord } from '../../models/DbRecords';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
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

  getOne: async (id: string): Promise<GameDbRecord| undefined> => {
    const param : GetItemCommandInput = {
      TableName: process.env.gamesTableName,
      Key: marshall({ id }),
    };

    const result = await getClient().send(new GetItemCommand(param));

    return result.Item ? unmarshall(result.Item) as GameDbRecord : undefined;
  },

  updateOne: async (record: GameDbRecord) => {
    const param : PutItemCommandInput = {
      TableName: process.env.gamesTableName,
      Item: marshall(record),
    };

    await getClient().send(new PutItemCommand(param));
  },
};
