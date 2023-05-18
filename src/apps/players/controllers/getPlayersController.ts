import { APIGatewayProxyEvent } from 'aws-lambda';
import { PlayerDbRecord } from '../../../models/DbRecords';
import { PlayerRepository } from '../../../helpers/repositories/PlayerRepository';

/**
 * @name getPlayersController
 * @description Get all players from a game
 * @param {APIGatewayProxyEvent} request
 *
 * @returns {Promise<APIGatewayProxyResult>}
 */
export const getPlayersController = async (request: APIGatewayProxyEvent) => {
  const players : PlayerDbRecord[] = await PlayerRepository.getByGameId(request.pathParameters?.gameId as string);

  if (players.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'No players found',
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      results: players,
    }),
  };
};
