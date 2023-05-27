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
    const winner = players.find((player) => player.healthPoints > 0) as PlayerDbRecord;
    game.isFinished = true;
    game.winner = {
      playerId: winner.id as string,
      name: winner.name as string,
    };

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

  // add a card to the player's hand
  addCardToPlayerHand(nextPlayer);

  if (nextPlayer.handCards.length === 0) {
    // play next turn
    playNextTurn(nextPlayer.id, players, game);
  }
};

export const addCardToPlayerHand = (player: PlayerDbRecord) => {
  player.mana += 1 + 1 * Math.floor(player.turnNumber/2);
  player.isPlaying = true;
  if (player.hiddenCards.length > 0) {
    const randomNumber = Math.floor(Math.random() * (player.hiddenCards.length - 1));
    if (player.handCards.length < 5) {
      player.handCards.push(player.hiddenCards[randomNumber]);
    }
    player.hiddenCards.splice(randomNumber, 1);
  } else {
    player.healthPoints -= 1;
  }
};
