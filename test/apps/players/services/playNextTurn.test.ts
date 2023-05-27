import { playNextTurn } from '../../../../src/apps/players/services/playNextTurn';
import { GameDbRecord, PlayerDbRecord } from '../../../../src/models/DbRecords';

describe('Play Next Turn Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('playNextTurn', () => {
    let players: PlayerDbRecord[];
    let game: GameDbRecord;

    let expectedPlayers: PlayerDbRecord[];
    let expectedGame: GameDbRecord;

    beforeEach(() => {
      players = [
            {
              id: 'playerId',
              name: 'player1',
              isPlaying: true,
              playOrder: 1,
              turnNumber: 1,
              handCards: ['1', '2', '3', '4', '5'],
              hiddenCards: ['1', '1'],
              _gameId: 'gameId',
              mana: 1,
              healthPoints: 1,
            } as PlayerDbRecord,
            {
              id: 'playerId2',
              name: 'player2',
              playOrder: 2,
              turnNumber: 1,
              healthPoints: 10,
              handCards: [],
              hiddenCards: [],
              _gameId: 'gameId',
              isPlaying: false,
              mana: 0,
            } as PlayerDbRecord,
      ];

      game = {
        id: 'gameId',
        turnNumber: 1,
        isFinished: false,
      };

      expectedPlayers = [
        {
          id: 'playerId',
          name: 'player1',
          isPlaying: true,
          playOrder: 1,
          turnNumber: 2,
          handCards: ['1', '2', '3', '4', '5'],
          hiddenCards: ['1'],
          mana: 3,
          healthPoints: 1,
          _gameId: 'gameId',
        } as PlayerDbRecord,
        {
          id: 'playerId2',
          name: 'player2',
          playOrder: 2,
          turnNumber: 2,
          healthPoints: 9,
          handCards: [],
          hiddenCards: [],
          _gameId: 'gameId',
          isPlaying: false,
          mana: 1,
        } as PlayerDbRecord,
      ];

      expectedGame = {
        id: 'gameId',
        turnNumber: 2,
        isFinished: false,
      };
    });

    it('should end game', async () => {
      players[1].healthPoints = 0;
      expectedGame.isFinished = true;
      expectedGame.turnNumber = 1;
      expectedGame.winner = {
        playerId: 'playerId',
        name: 'player1',
      };

      playNextTurn('playerId', players, game);

      expect(players).toStrictEqual(players);
      expect(game).toStrictEqual(expectedGame);
    });

    it('should play two next turn with bleeding and overload', async () => {
      playNextTurn('playerId', players, game);

      expect(players).toStrictEqual(expectedPlayers);
      expect(game).toStrictEqual(expectedGame);
    });

    it('should play next turn and add card to hand', async () => {

      const expectedPlayer1 = {
        ...expectedPlayers[0],
        turnNumber: 2,
        isPlaying: false,
        mana: 1,
        hiddenCards: ['1', '1'],
      };

      players[1].handCards = ['1'];
      players[1].hiddenCards = ['2'];
      expectedPlayers[1].handCards = ['1', '2'];
      expectedPlayers[1].healthPoints = 10;
      expectedPlayers[1].hiddenCards = [];
      expectedPlayers[1].isPlaying = true;
      expectedPlayers[1].turnNumber = 1;

      expectedGame.turnNumber = 1;

      playNextTurn('playerId', players, game);

      expectedPlayers[0] = expectedPlayer1;

      expect(players).toStrictEqual(expectedPlayers);
      expect(game).toStrictEqual(expectedGame);
    });
  });
});

