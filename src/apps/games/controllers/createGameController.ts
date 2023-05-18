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


/**
 * @name gameValidator
 * @description Validate input in request for CreateGame
 * @param {APIGatewayProxyEvent} request
 *
 * @returns {CreateGameInput}
 */
export const gameValidator = async (request: APIGatewayProxyEvent):  Promise<CreateGameInput> => {
  if (!request.body) throw new Error('Missing body');

  const schema = Joi.object({
    player1Name: Joi.string().required(),
    player2Name: Joi.string().required(),
  });

  const body = JSON.parse(request.body);

  await schema.validateAsync(body);

  return body as CreateGameInput;
};
