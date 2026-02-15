import { PlayerStats } from "@/pages/Index";

interface VictoryScreenProps {
  player: PlayerStats;
  onMenu: () => void;
}

const VictoryScreen = ({ player, onMenu }: VictoryScreenProps) => {
  return (
    <div className="pixel-border bg-card p-8 text-center animate-pixel-fade-in">
      <div className="text-6xl mb-4 animate-float">👑</div>
      <h1 className="text-lg text-primary mb-2">Победа!</h1>
      <p className="text-[10px] text-foreground mb-6">
        Ты победил дракона и стал легендой!
      </p>

      <div className="pixel-border bg-background p-4 mb-6 inline-block">
        <p className="text-[10px] text-primary mb-2">Статистика героя:</p>
        <div className="space-y-1 text-[9px] text-foreground">
          <p>🧙 Уровень: {player.level}</p>
          <p>⚔️ Атака: {player.attack}</p>
          <p>🛡️ Защита: {player.defense}</p>
          <p>💰 Золото: {player.gold}</p>
          <p>🎒 Предметов: {player.inventory.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {player.inventory.map((item, i) => (
          <span
            key={i}
            className="pixel-border bg-background px-2 py-1 text-[8px]"
            title={item.description}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <button
        onClick={onMenu}
        className="pixel-border-gold bg-primary px-8 py-3 text-xs text-primary-foreground hover:brightness-110 transition-all"
      >
        🏠 В главное меню
      </button>
    </div>
  );
};

export default VictoryScreen;
