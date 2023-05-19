export interface GameDbRecord {
    id: string;
    turnNumber: number;
    isFinished: boolean;
    winner?: {
        playerId: string;
        name: string;
    }
}

export interface PlayerDbRecord {
    id: string;
    _gameId: string;
    isPlaying: boolean;
    name: string;
    healthPoints: number;
    handCards: string[];
    hiddenCards: string[];
    mana: number;
    turnNumber: number;
    playOrder: number;
}
