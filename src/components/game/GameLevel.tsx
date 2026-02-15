import { useState, useEffect } from "react";
import { PlayerStats, Enemy, Item } from "@/pages/Index";
import PlayerHUD from "./PlayerHUD";

interface GameLevelProps {
  level: number;
  player: PlayerStats;
  onBattle: (enemy: Enemy) => void;
  onCollectItem: (item: Item) => void;
  onUsePotion: () => void;
  onNextLevel: () => void;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerStats>>;
}

interface LevelEvent {
  id: string;
  text: string;
  emoji: string;
  type: "story" | "enemy" | "item" | "exit";
  enemy?: Enemy;
  item?: Item;
}

const LEVELS: Record<number, { name: string; description: string; events: LevelEvent[] }> = {
  1: {
    name: "Тёмный лес",
    description: "Ты входишь в мрачный лес. Деревья скрипят на ветру...",
    events: [
      {
        id: "1-1",
        text: "На тропинке лежит старый меч!",
        emoji: "⚔️",
        type: "item",
        item: { id: "sword1", name: "Ржавый меч", emoji: "🗡️", type: "weapon", value: 5, description: "+5 к атаке" },
      },
      {
        id: "1-2",
        text: "Из кустов выскакивает гоблин!",
        emoji: "👺",
        type: "enemy",
        enemy: { name: "Гоблин", emoji: "👺", hp: 40, maxHp: 40, attack: 8, defense: 2, xpReward: 25, goldReward: 10 },
      },
      {
        id: "1-3",
        text: "Ты находишь целебное зелье у дерева.",
        emoji: "🧪",
        type: "item",
        item: { id: "potion1", name: "Зелье здоровья", emoji: "🧪", type: "potion", value: 30, description: "Восстанавливает 30 HP" },
      },
      {
        id: "1-4",
        text: "Огромный паук преграждает путь!",
        emoji: "🕷️",
        type: "enemy",
        enemy: { name: "Гигантский паук", emoji: "🕷️", hp: 55, maxHp: 55, attack: 10, defense: 3, xpReward: 35, goldReward: 15 },
      },
      { id: "1-5", text: "Впереди виден выход из леса!", emoji: "🌅", type: "exit" },
    ],
  },
  2: {
    name: "Забытые руины",
    description: "Древние руины возвышаются перед тобой...",
    events: [
      {
        id: "2-1",
        text: "Скелет-страж охраняет вход!",
        emoji: "💀",
        type: "enemy",
        enemy: { name: "Скелет-страж", emoji: "💀", hp: 65, maxHp: 65, attack: 14, defense: 6, xpReward: 45, goldReward: 20 },
      },
      {
        id: "2-2",
        text: "В сундуке блестит зелье!",
        emoji: "🧪",
        type: "item",
        item: { id: "potion2", name: "Большое зелье", emoji: "🧪", type: "potion", value: 50, description: "Восстанавливает 50 HP" },
      },
      {
        id: "2-3",
        text: "Среди камней спрятан магический щит.",
        emoji: "🛡️",
        type: "item",
        item: { id: "shield1", name: "Магический щит", emoji: "🛡️", type: "weapon", value: 4, description: "+4 к защите" },
      },
      {
        id: "2-4",
        text: "Тёмный маг обрушивает заклинание!",
        emoji: "🧙‍♂️",
        type: "enemy",
        enemy: { name: "Тёмный маг", emoji: "🧙‍♂️", hp: 50, maxHp: 50, attack: 18, defense: 4, xpReward: 55, goldReward: 30 },
      },
      { id: "2-5", text: "Лестница ведёт глубже в руины...", emoji: "🪜", type: "exit" },
    ],
  },
  3: {
    name: "Логово дракона",
    description: "Жар огня обжигает лицо. Ты в логове дракона!",
    events: [
      {
        id: "3-1",
        text: "Вулканический голем преграждает путь!",
        emoji: "🪨",
        type: "enemy",
        enemy: { name: "Вулканический голем", emoji: "🪨", hp: 80, maxHp: 80, attack: 16, defense: 10, xpReward: 60, goldReward: 35 },
      },
      {
        id: "3-2",
        text: "На алтаре лежит легендарный меч!",
        emoji: "⚔️",
        type: "item",
        item: { id: "sword2", name: "Драконий клинок", emoji: "⚔️", type: "weapon", value: 12, description: "+12 к атаке" },
      },
      {
        id: "3-3",
        text: "В тайнике — эликсир жизни!",
        emoji: "🧪",
        type: "item",
        item: { id: "potion3", name: "Эликсир жизни", emoji: "🧪", type: "potion", value: 80, description: "Восстанавливает 80 HP" },
      },
      {
        id: "3-4",
        text: "ДРАКОН ПРОБУЖДАЕТСЯ!",
        emoji: "🐉",
        type: "enemy",
        enemy: { name: "Древний дракон", emoji: "🐉", hp: 150, maxHp: 150, attack: 25, defense: 12, xpReward: 200, goldReward: 100 },
      },
      { id: "3-5", text: "Дракон повержен! Ты — легенда!", emoji: "👑", type: "exit" },
    ],
  },
};

const GameLevel = ({
  level,
  player,
  onBattle,
  onCollectItem,
  onUsePotion,
  onNextLevel,
  setPlayer,
}: GameLevelProps) => {
  const [eventIndex, setEventIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [defeatedEnemies, setDefeatedEnemies] = useState<Set<string>>(new Set());
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());

  const levelData = LEVELS[level];
  const currentEvent = levelData.events[eventIndex];

  useEffect(() => {
    setEventIndex(0);
    setMessage(levelData.description);
    setDefeatedEnemies(new Set());
    setCollectedItems(new Set());
  }, [level]);

  const handleEvent = () => {
    if (!currentEvent) return;

    if (currentEvent.type === "enemy" && currentEvent.enemy) {
      if (defeatedEnemies.has(currentEvent.id)) {
        setMessage("Враг уже побеждён! Идём дальше...");
        setEventIndex((prev) => prev + 1);
        return;
      }
      onBattle(currentEvent.enemy);
      setDefeatedEnemies((prev) => new Set(prev).add(currentEvent.id));
      return;
    }

    if (currentEvent.type === "item" && currentEvent.item) {
      if (collectedItems.has(currentEvent.id)) {
        setMessage("Здесь уже пусто.");
        setEventIndex((prev) => prev + 1);
        return;
      }

      onCollectItem(currentEvent.item);
      setCollectedItems((prev) => new Set(prev).add(currentEvent.id));

      if (currentEvent.item.type === "weapon") {
        if (currentEvent.item.name.includes("щит")) {
          setPlayer((prev) => ({ ...prev, defense: prev.defense + currentEvent.item!.value }));
        } else {
          setPlayer((prev) => ({ ...prev, attack: prev.attack + currentEvent.item!.value }));
        }
      }

      setMessage(`Получено: ${currentEvent.item.emoji} ${currentEvent.item.name}!`);
      setTimeout(() => setEventIndex((prev) => prev + 1), 1200);
      return;
    }

    if (currentEvent.type === "exit") {
      onNextLevel();
      return;
    }

    setMessage(currentEvent.text);
    setEventIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentEvent) {
      setMessage(currentEvent.text);
    }
  }, [eventIndex]);

  return (
    <div>
      <PlayerHUD player={player} onUsePotion={onUsePotion} />

      <div className="pixel-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs text-primary">{levelData.name}</h2>
          <span className="text-[8px] text-muted-foreground">Уровень {level}/3</span>
        </div>

        <div className="pixel-border bg-background p-6 mb-4 text-center min-h-[160px] flex flex-col items-center justify-center">
          {currentEvent && (
            <div className="animate-pixel-fade-in">
              <span className="text-5xl block mb-4">{currentEvent.emoji}</span>
              <p className="text-[10px] text-foreground leading-relaxed">{message}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {currentEvent && currentEvent.type === "enemy" && !defeatedEnemies.has(currentEvent.id) && (
            <button
              onClick={handleEvent}
              className="flex-1 pixel-border-gold bg-destructive px-4 py-3 text-[10px] text-destructive-foreground hover:brightness-110 transition-all"
            >
              ⚔️ В бой!
            </button>
          )}
          {currentEvent && currentEvent.type === "item" && !collectedItems.has(currentEvent.id) && (
            <button
              onClick={handleEvent}
              className="flex-1 pixel-border-gold bg-accent px-4 py-3 text-[10px] text-accent-foreground hover:brightness-110 transition-all"
            >
              ✋ Подобрать
            </button>
          )}
          {currentEvent && currentEvent.type === "exit" && (
            <button
              onClick={handleEvent}
              className="flex-1 pixel-border-gold bg-primary px-4 py-3 text-[10px] text-primary-foreground hover:brightness-110 transition-all"
            >
              🚪 Дальше
            </button>
          )}
          {currentEvent && currentEvent.type === "story" && (
            <button
              onClick={handleEvent}
              className="flex-1 pixel-border bg-muted px-4 py-3 text-[10px] text-foreground hover:bg-muted/80 transition-all"
            >
              Продолжить →
            </button>
          )}
          {currentEvent && defeatedEnemies.has(currentEvent.id) && currentEvent.type === "enemy" && (
            <button
              onClick={() => setEventIndex((prev) => prev + 1)}
              className="flex-1 pixel-border bg-muted px-4 py-3 text-[10px] text-foreground hover:bg-muted/80 transition-all"
            >
              Продолжить →
            </button>
          )}
          {currentEvent && collectedItems.has(currentEvent.id) && currentEvent.type === "item" && (
            <button
              onClick={() => setEventIndex((prev) => prev + 1)}
              className="flex-1 pixel-border bg-muted px-4 py-3 text-[10px] text-foreground hover:bg-muted/80 transition-all"
            >
              Продолжить →
            </button>
          )}
        </div>

        {player.inventory.length > 0 && (
          <div className="mt-4 pixel-border bg-background p-3">
            <p className="text-[8px] text-muted-foreground mb-2">Инвентарь:</p>
            <div className="flex flex-wrap gap-2">
              {player.inventory.map((item, i) => (
                <span
                  key={i}
                  className="pixel-border bg-card px-2 py-1 text-[8px] text-foreground"
                  title={item.description}
                >
                  {item.emoji} {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameLevel;
