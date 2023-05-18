import { APIGatewayProxyEvent } from 'aws-lambda';
import { createGame } from '../services/createGame';
import { CreateGameInput } from '../../../models/games';
import Joi from 'joi';


/**
 * @name createGameController
 * @description Create a new game and return the game id
 * @param {APIGatewayProxyEvent} request
 *
 * @returns {Promise<APIGatewayProxyResult>}
 */
export const createGameController = async (request: APIGatewayProxyEvent) => {
  let input: CreateGameInput;
  try {
    input = await gameValidator(request);
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: await createGame(input),
    }),
  };
};

const gameValidator = async (request: APIGatewayProxyEvent):  Promise<CreateGameInput> => {
  const schema = Joi.object({
    player1Name: Joi.string().required(),
    player2Name: Joi.string().required(),
  });

  await schema.validateAsync(request.body);

  return request.body as unknown as CreateGameInput;
};
