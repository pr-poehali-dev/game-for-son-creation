import { useState } from "react";
import MainMenu from "@/components/game/MainMenu";
import GameLevel from "@/components/game/GameLevel";
import BattleScreen from "@/components/game/BattleScreen";
import GameOver from "@/components/game/GameOver";
import VictoryScreen from "@/components/game/VictoryScreen";

export type GameScreen = "menu" | "level" | "battle" | "gameover" | "victory";

export interface PlayerStats {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  level: number;
  xp: number;
  xpToNext: number;
  gold: number;
  inventory: Item[];
}

export interface Item {
  id: string;
  name: string;
  emoji: string;
  type: "weapon" | "potion" | "key" | "treasure";
  value: number;
  description: string;
}

export interface Enemy {
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  xpReward: number;
  goldReward: number;
}

const INITIAL_PLAYER: PlayerStats = {
  hp: 100,
  maxHp: 100,
  attack: 12,
  defense: 5,
  level: 1,
  xp: 0,
  xpToNext: 50,
  gold: 0,
  inventory: [],
};

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>("menu");
  const [player, setPlayer] = useState<PlayerStats>(INITIAL_PLAYER);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);

  const startGame = () => {
    setPlayer(INITIAL_PLAYER);
    setCurrentLevel(1);
    setScreen("level");
  };

  const startBattle = (enemy: Enemy) => {
    setCurrentEnemy(enemy);
    setScreen("battle");
  };

  const onBattleWin = (xpGain: number, goldGain: number) => {
    setPlayer((prev) => {
      let newXp = prev.xp + xpGain;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNext;
      let newMaxHp = prev.maxHp;
      let newAttack = prev.attack;
      let newDefense = prev.defense;

      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel++;
        newXpToNext = Math.floor(newXpToNext * 1.5);
        newMaxHp += 15;
        newAttack += 3;
        newDefense += 2;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNext: newXpToNext,
        maxHp: newMaxHp,
        attack: newAttack,
        defense: newDefense,
        gold: prev.gold + goldGain,
      };
    });
    setScreen("level");
  };

  const onBattleLose = () => {
    setScreen("gameover");
  };

  const collectItem = (item: Item) => {
    setPlayer((prev) => ({
      ...prev,
      inventory: [...prev.inventory, item],
    }));
  };

  const usePotion = () => {
    setPlayer((prev) => {
      const potionIndex = prev.inventory.findIndex((i) => i.type === "potion");
      if (potionIndex === -1) return prev;
      const newInventory = [...prev.inventory];
      const potion = newInventory.splice(potionIndex, 1)[0];
      return {
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + potion.value),
        inventory: newInventory,
      };
    });
  };

  const nextLevel = () => {
    if (currentLevel >= 3) {
      setScreen("victory");
    } else {
      setCurrentLevel((prev) => prev + 1);
      setScreen("level");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-pixel-fade-in">
        {screen === "menu" && <MainMenu onStart={startGame} />}
        {screen === "level" && (
          <GameLevel
            level={currentLevel}
            player={player}
            onBattle={startBattle}
            onCollectItem={collectItem}
            onUsePotion={usePotion}
            onNextLevel={nextLevel}
            setPlayer={setPlayer}
          />
        )}
        {screen === "battle" && currentEnemy && (
          <BattleScreen
            player={player}
            setPlayer={setPlayer}
            enemy={currentEnemy}
            onWin={onBattleWin}
            onLose={onBattleLose}
            onUsePotion={usePotion}
          />
        )}
        {screen === "gameover" && <GameOver onRestart={startGame} onMenu={() => setScreen("menu")} />}
        {screen === "victory" && <VictoryScreen player={player} onMenu={() => setScreen("menu")} />}
      </div>
    </div>
  );
};

export default Index;
