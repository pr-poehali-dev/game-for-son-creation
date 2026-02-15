interface GameOverProps {
  onRestart: () => void;
  onMenu: () => void;
}

const GameOver = ({ onRestart, onMenu }: GameOverProps) => {
  return (
    <div className="pixel-border bg-card p-8 text-center animate-pixel-fade-in">
      <div className="text-6xl mb-6">💀</div>
      <h1 className="text-lg text-destructive mb-4">Конец игры</h1>
      <p className="text-[10px] text-muted-foreground mb-8">
        Герой пал в бою... Но каждый может попробовать снова!
      </p>

      <div className="space-y-3">
        <button
          onClick={onRestart}
          className="block w-full pixel-border-gold bg-primary px-6 py-3 text-xs text-primary-foreground hover:brightness-110 transition-all"
        >
          🔄 Начать заново
        </button>
        <button
          onClick={onMenu}
          className="block w-full pixel-border bg-muted px-6 py-3 text-xs text-foreground hover:bg-muted/80 transition-all"
        >
          📋 Главное меню
        </button>
      </div>
    </div>
  );
};

export default GameOver;
