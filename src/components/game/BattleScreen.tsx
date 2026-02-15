import { useState, useEffect } from "react";
import { PlayerStats, Enemy } from "@/pages/Index";
import PixelBar from "./PixelBar";

interface BattleScreenProps {
  player: PlayerStats;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
  enemy: Enemy;
  onWin: (xp: number, gold: number) => void;
  onLose: () => void;
  onUsePotion: () => void;
}

const BattleScreen = ({ player, setPlayer, enemy, onWin, onLose, onUsePotion }: BattleScreenProps) => {
  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [battleLog, setBattleLog] = useState<string[]>([`${enemy.emoji} ${enemy.name} появляется!`]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleOver, setBattleOver] = useState(false);
  const [shakeEnemy, setShakeEnemy] = useState(false);
  const [shakePlayer, setShakePlayer] = useState(false);

  const addLog = (msg: string) => {
    setBattleLog((prev) => [...prev.slice(-4), msg]);
  };

  const calcDamage = (atk: number, def: number) => {
    const base = Math.max(1, atk - def);
    const variance = Math.floor(Math.random() * 5) - 2;
    return Math.max(1, base + variance);
  };

  const handleAttack = () => {
    if (!isPlayerTurn || battleOver) return;

    const isCrit = Math.random() < 0.15;
    let dmg = calcDamage(player.attack, enemy.defense);
    if (isCrit) dmg = Math.floor(dmg * 1.8);

    const newEnemyHp = Math.max(0, enemyHp - dmg);
    setEnemyHp(newEnemyHp);
    setShakeEnemy(true);
    setTimeout(() => setShakeEnemy(false), 300);

    addLog(isCrit ? `💥 Крит! Ты наносишь ${dmg} урона!` : `⚔️ Ты наносишь ${dmg} урона`);

    if (newEnemyHp <= 0) {
      addLog(`🎉 ${enemy.name} повержен!`);
      setBattleOver(true);
      return;
    }

    setIsPlayerTurn(false);
  };

  const handleDefend = () => {
    if (!isPlayerTurn || battleOver) return;
    addLog("🛡️ Ты принимаешь защитную стойку!");
    setIsPlayerTurn(false);
  };

  const handlePotion = () => {
    if (!isPlayerTurn || battleOver) return;
    const hasPot = player.inventory.some((i) => i.type === "potion");
    if (!hasPot) {
      addLog("❌ Нет зелий!");
      return;
    }
    onUsePotion();
    addLog("🧪 Ты используешь зелье здоровья!");
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (isPlayerTurn || battleOver) return;

    const timer = setTimeout(() => {
      const isDefending = battleLog[battleLog.length - 1]?.includes("защитную");
      let dmg = calcDamage(enemy.attack, player.defense);
      if (isDefending) dmg = Math.floor(dmg * 0.4);

      setPlayer((prev) => {
        const newHp = Math.max(0, prev.hp - dmg);
        if (newHp <= 0) {
          addLog(`💀 ${enemy.name} наносит ${dmg} урона. Ты пал...`);
          setBattleOver(true);
          setTimeout(() => onLose(), 1500);
          return { ...prev, hp: 0 };
        }
        addLog(`${enemy.emoji} ${enemy.name} наносит ${dmg} урона`);
        return { ...prev, hp: newHp };
      });

      setShakePlayer(true);
      setTimeout(() => setShakePlayer(false), 300);
      setIsPlayerTurn(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, battleOver]);

  const handleVictory = () => {
    onWin(enemy.xpReward, enemy.goldReward);
  };

  return (
    <div className="pixel-border bg-card p-6 animate-pixel-fade-in">
      <h2 className="text-xs text-destructive text-center mb-4">⚔️ БОЙ ⚔️</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`pixel-border bg-background p-4 text-center ${shakePlayer ? "animate-shake" : ""}`}>
          <span className="text-4xl block mb-2">🧙</span>
          <p className="text-[10px] text-primary mb-2">Герой</p>
          <PixelBar value={player.hp} max={player.maxHp} color="hsl(140, 60%, 40%)" label="HP" />
        </div>

        <div className={`pixel-border bg-background p-4 text-center ${shakeEnemy ? "animate-shake" : ""}`}>
          <span className="text-4xl block mb-2">{enemy.emoji}</span>
          <p className="text-[10px] text-destructive mb-2">{enemy.name}</p>
          <PixelBar value={enemyHp} max={enemy.maxHp} color="hsl(0, 80%, 50%)" label="HP" />
        </div>
      </div>

      <div className="pixel-border bg-background p-3 mb-4 min-h-[100px]">
        {battleLog.map((log, i) => (
          <p
            key={i}
            className={`text-[9px] leading-relaxed ${
              i === battleLog.length - 1 ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {log}
          </p>
        ))}
      </div>

      {!battleOver && isPlayerTurn && (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleAttack}
            className="pixel-border-gold bg-destructive px-3 py-3 text-[9px] text-destructive-foreground hover:brightness-110 transition-all"
          >
            ⚔️ Атака
          </button>
          <button
            onClick={handleDefend}
            className="pixel-border bg-blue-800 px-3 py-3 text-[9px] text-blue-100 hover:brightness-110 transition-all"
          >
            🛡️ Защита
          </button>
          <button
            onClick={handlePotion}
            className="pixel-border bg-accent px-3 py-3 text-[9px] text-accent-foreground hover:brightness-110 transition-all"
          >
            🧪 Зелье
          </button>
        </div>
      )}

      {!battleOver && !isPlayerTurn && (
        <p className="text-[10px] text-center text-muted-foreground animate-blink">
          Враг атакует...
        </p>
      )}

      {battleOver && enemyHp <= 0 && (
        <div className="text-center">
          <p className="text-[10px] text-primary mb-2">
            +{enemy.xpReward} XP | +{enemy.goldReward} 💰
          </p>
          <button
            onClick={handleVictory}
            className="pixel-border-gold bg-primary px-6 py-3 text-[10px] text-primary-foreground hover:brightness-110 transition-all"
          >
            Продолжить →
          </button>
        </div>
      )}
    </div>
  );
};

export default BattleScreen;
