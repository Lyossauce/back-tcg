import { GameDbRecord, PlayerDbRecord } from '../../../models/DbRecords';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { applyMove } from '../services/applyMove';
import { GameRepository } from '../../../helpers/repositories/GameRepository';
import { isPlayerAllowedToPlay } from '../services/isPlayerAllowedToPlay';
import Joi from 'joi';
import { PlayerRepository } from '../../../helpers/repositories/PlayerRepository';
import { PostPlayerCardInput } from '../../../models/players';

/**
 * @name postPlayerCardController
 * @description Apply the player move to the game
 * @param {APIGatewayProxyEvent} request
 *
 * @returns {Promise<APIGatewayProxyResult>}
 */
export const postPlayerCardController = async (request: APIGatewayProxyEvent) => {
  // IMPROVEMENT: execute validation and data fetching in parallel
  const input : PostPlayerCardInput = await playerCardValidator(request);

  const players : PlayerDbRecord[] = await PlayerRepository.getByGameId(input.gameId);

  if (players.length === 0 || !players.find((player) => player.id === input.playerId)) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'No players found',
      }),
    };
  }

  const game : GameDbRecord | undefined = await GameRepository.getOne(input.gameId);

  if (!game) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'No game found',
      }),
    };
  }

  const canPlay : boolean = await isPlayerAllowedToPlay(input, players);

  if (!canPlay) {
    return {
      statusCode: 409,
      body: JSON.stringify({
        message: 'The player is not allowed to play this move',
      }),
    };
  }

  await applyMove(input, players, game);

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: input.cardId,
    }),
  };
};


const playerCardValidator = async (request: APIGatewayProxyEvent):  Promise<PostPlayerCardInput> => {
  if (!request.body) throw new Error('Missing body');

  const schema = Joi.object({
    cardId: Joi.string().required(),
  });

  const body = JSON.parse(request.body);

  await schema.validateAsync(body);

  return {
    ...body,
    playerId: request.pathParameters?.playerId as string,
    gameId: request.pathParameters?.gameId as string,
  };
};
