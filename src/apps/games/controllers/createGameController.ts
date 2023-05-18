import { APIGatewayProxyEvent } from 'aws-lambda';

export const createGameController = async (request: APIGatewayProxyEvent) => {
  console.log('Hello world');
};
