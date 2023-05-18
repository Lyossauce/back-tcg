import { GameDbRecord, PlayerDbRecord } from '../../../models/DbRecords';

export const playNextTurn = async (playerId: string, players: PlayerDbRecord[], game: GameDbRecord) => {
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
  let nextPlayer : PlayerDbRecord = players.find((player) => player.playOrder === currentPlayer.playOrder + 1) as PlayerDbRecord;
  if (!nextPlayer) {
    game.turnNumber++;
    nextPlayer = players[0];
  }

  nextPlayer.mana += 1;
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
    await playNextTurn(nextPlayer.id, players, game);
  }
};
