import { isPlayerAllowedToPlay } from '../../../../src/apps/players/services/isPlayerAllowedToPlay';
import { PlayerDbRecord } from '../../../../src/models/DbRecords';
import { PostPlayerCardInput } from '../../../../src/models/players';

describe('Is Player Allowed To Play Service', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isPlayerAllowedToPlay', () => {
    const input: PostPlayerCardInput = {
      cardId: '1',
      playerId: 'playerId',
      gameId: 'gameId',
    };

    let players : PlayerDbRecord[];

    it('should return true when player is allowed to play', async () => {
      players = [
        {
          id: 'playerId',
          isPlaying: true,
          playOrder: 1,
          turnNumber: 1,
          handCards: ['1'],
          mana: 1,
          healthPoints: 1,
        } as PlayerDbRecord,
        {
          id: 'playerId2',
          playOrder: 2,
          turnNumber: 1,
        } as PlayerDbRecord,
      ];

      const response = await isPlayerAllowedToPlay(input, players);

      expect(response).toEqual(true);
    });

    it('should return false when player is not playing', async () => {
      players = [
          {
            id: 'playerId',
            isPlaying: false,
          } as PlayerDbRecord,
      ];

      const response = await isPlayerAllowedToPlay(input, players);

      expect(response).toEqual(false);
    });

    it('should return false when it is not the players turn', async () => {
      players = [
          {
            id: 'playerId',
            isPlaying: true,
            playOrder: 2,
            turnNumber: 1,
          } as PlayerDbRecord,
          {
            id: 'playerId2',
            playOrder: 3,
            turnNumber: 1,
          } as PlayerDbRecord,
          {
            id: 'playerId3',
            playOrder: 1,
            turnNumber: 1,
          } as PlayerDbRecord,
      ];

      const response = await isPlayerAllowedToPlay(input, players);

      expect(response).toEqual(false);
    });

    it('should return true when player is skipping', async () => {
      players = [
          {
            id: 'playerId',
            isPlaying: true,
            playOrder: 1,
            turnNumber: 1,
            handCards: ['1'],
            mana: 1,
            healthPoints: 1,
          } as PlayerDbRecord,
          {
            id: 'playerId2',
            playOrder: 2,
            turnNumber: 1,
          } as PlayerDbRecord,
      ];

      const response = await isPlayerAllowedToPlay({ ...input, cardId: 'skip' }, players);

      expect(response).toEqual(true);
    });

    it('should return false when player has not the correct card in his hand', async () => {
      players = [
            {
              id: 'playerId',
              isPlaying: true,
              playOrder: 1,
              turnNumber: 1,
              handCards: ['2'],
              mana: 1,
              healthPoints: 1,
            } as PlayerDbRecord,
            {
              id: 'playerId2',
              playOrder: 2,
              turnNumber: 1,
            } as PlayerDbRecord,
      ];

      const response = await isPlayerAllowedToPlay(input, players);

      expect(response).toEqual(false);
    });

    it('should return false when player has not enough mana', async () => {
      players = [
              {
                id: 'playerId',
                isPlaying: true,
                playOrder: 1,
                turnNumber: 1,
                handCards: ['1'],
                mana: 0,
                healthPoints: 1,
              } as PlayerDbRecord,
              {
                id: 'playerId2',
                playOrder: 2,
                turnNumber: 1,
              } as PlayerDbRecord,
      ];

      const response = await isPlayerAllowedToPlay(input, players);

      expect(response).toEqual(false);
    });

    it('should return false when player has no more health points', async () => {
      players = [
                {
                  id: 'playerId',
                  isPlaying: true,
                  playOrder: 1,
                  turnNumber: 1,
                  handCards: ['1'],
                  mana: 1,
                  healthPoints: 0,
                } as PlayerDbRecord,
                {
                  id: 'playerId2',
                  playOrder: 2,
                  turnNumber: 1,
                } as PlayerDbRecord,
      ];

      const response = await isPlayerAllowedToPlay(input, players);

      expect(response).toEqual(false);
    });
  });
});
