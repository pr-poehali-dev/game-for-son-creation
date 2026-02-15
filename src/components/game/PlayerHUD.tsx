import { PlayerStats } from "@/pages/Index";
import PixelBar from "./PixelBar";

interface PlayerHUDProps {
  player: PlayerStats;
  onUsePotion: () => void;
}

const PlayerHUD = ({ player, onUsePotion }: PlayerHUDProps) => {
  const potionCount = player.inventory.filter((i) => i.type === "potion").length;

  return (
    <div className="pixel-border bg-card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧙</span>
          <div>
            <p className="text-[10px] text-primary">Герой</p>
            <p className="text-[8px] text-muted-foreground">Ур. {player.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[8px] text-primary">⚔️ {player.attack}</span>
          <span className="text-[8px] text-blue-400">🛡️ {player.defense}</span>
          <span className="text-[8px] text-yellow-400">💰 {player.gold}</span>
        </div>
      </div>

      <div className="space-y-2">
        <PixelBar value={player.hp} max={player.maxHp} color="hsl(140, 60%, 40%)" label="HP" />
        <PixelBar value={player.xp} max={player.xpToNext} color="hsl(45, 100%, 60%)" label="XP" />
      </div>

      {potionCount > 0 && (
        <button
          onClick={onUsePotion}
          className="mt-3 pixel-border bg-accent/20 px-3 py-1 text-[8px] text-accent-foreground hover:bg-accent/40 transition-colors"
        >
          🧪 Зелье x{potionCount}
        </button>
      )}
    </div>
  );
};

export default PlayerHUD;
