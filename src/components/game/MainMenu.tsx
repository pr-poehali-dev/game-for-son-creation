import { useState } from "react";

interface MainMenuProps {
  onStart: () => void;
}

const MainMenu = ({ onStart }: MainMenuProps) => {
  const [selected, setSelected] = useState(0);
  const menuItems = [
    { label: "Начать игру", action: onStart },
    { label: "Об игре", action: () => setShowAbout(true) },
  ];
  const [showAbout, setShowAbout] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") setSelected((s) => (s - 1 + menuItems.length) % menuItems.length);
    if (e.key === "ArrowDown") setSelected((s) => (s + 1) % menuItems.length);
    if (e.key === "Enter") menuItems[selected].action();
  };

  if (showAbout) {
    return (
      <div className="pixel-border bg-card p-8 text-center">
        <h2 className="text-primary text-sm mb-6">Об игре</h2>
        <p className="text-[10px] leading-relaxed text-foreground/80 mb-4">
          Пиксельный квест — приключенческая
        </p>
        <p className="text-[10px] leading-relaxed text-foreground/80 mb-4">
          игра с боевой системой и предметами.
        </p>
        <p className="text-[10px] leading-relaxed text-foreground/80 mb-6">
          Пройди 3 уровня и стань героем!
        </p>
        <button
          onClick={() => setShowAbout(false)}
          className="pixel-border bg-muted px-6 py-3 text-[10px] text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Назад
        </button>
      </div>
    );
  }

  return (
    <div
      className="pixel-border bg-card p-8 text-center focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      autoFocus
    >
      <div className="mb-8">
        <div className="text-5xl mb-4 animate-float">⚔️</div>
        <h1 className="text-primary text-lg mb-2">Пиксельный</h1>
        <h1 className="text-primary text-lg mb-4">Квест</h1>
        <div className="flex justify-center gap-2 text-2xl mb-4">
          <span>🏰</span>
          <span>🐉</span>
          <span>💎</span>
        </div>
        <p className="text-[10px] text-muted-foreground">Приключение ждёт героя...</p>
      </div>

      <div className="space-y-3">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            onMouseEnter={() => setSelected(i)}
            className={`block w-full px-6 py-3 text-xs transition-all ${
              selected === i
                ? "pixel-border-gold bg-primary text-primary-foreground"
                : "pixel-border bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {selected === i && "▶ "}
            {item.label}
          </button>
        ))}
      </div>

      <p className="text-[8px] text-muted-foreground mt-8 animate-blink">
        Нажми «Начать игру»
      </p>
    </div>
  );
};

export default MainMenu;
