import { GameDbRecord, PlayerDbRecord } from '../../../models/DbRecords';

/**
 * @name playNextTurn
 * @description Apply the change of player turn
 * @param {string} playerId
 * @param {PlayerDbRecord[]} players
 * @param {GameDbRecord} game
 *
 * @returns {Promise<boolean>}
 */
export const playNextTurn = (playerId: string, players: PlayerDbRecord[], game: GameDbRecord) => {
  players = players.sort((a, b) => a.playOrder - b.playOrder);

  // Verify if the game is finished
  let numberOfDeadPlayers = 0;
  for (const player of players) {
    if (player.healthPoints <= 0) {
      numberOfDeadPlayers++;
    }
  }
  if (numberOfDeadPlayers === players.length - 1) {
    game.isFinished = true;

    return;
  }

  // find next player
  const currentPlayer : PlayerDbRecord = players.find((player) => player.id === playerId) as PlayerDbRecord;
  currentPlayer.turnNumber++;
  currentPlayer.isPlaying = false;
  let nextPlayer : PlayerDbRecord = players.find((player) => player.playOrder === currentPlayer.playOrder + 1) as PlayerDbRecord;
  if (!nextPlayer) {
    game.turnNumber++;
    nextPlayer = players[0];
  }

  nextPlayer.mana += 1;
  nextPlayer.isPlaying = true;
  // add a card to the player's hand
  if (nextPlayer.hiddenCards.length > 0) {
    const randomNumber = Math.floor(Math.random() * (nextPlayer.hiddenCards.length - 1));
    if (nextPlayer.handCards.length < 5) {
      nextPlayer.handCards.push(nextPlayer.hiddenCards[randomNumber]);
    }
    nextPlayer.hiddenCards.splice(randomNumber, 1);
  }

  // verify if player has cards in his hand
  if (nextPlayer.handCards.length === 0) {
    nextPlayer.healthPoints -= 1;
    // play next turn
    playNextTurn(nextPlayer.id, players, game);
  }
};
