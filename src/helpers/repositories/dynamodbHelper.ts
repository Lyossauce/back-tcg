import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

/**
 * @name getClient
 * @description Get DynamoDB client
 *
 * @returns {DynamoDBClient} DynamoDb Client
 */
export const getClient = (): DynamoDBClient => {

  return new DynamoDBClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'xxxx',
      secretAccessKey: 'xxxx',
    },
    endpoint: 'http://0.0.0.0:8000',
  });
};
