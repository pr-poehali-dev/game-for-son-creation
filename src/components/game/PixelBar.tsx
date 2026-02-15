interface PixelBarProps {
  value: number;
  max: number;
  color: string;
  label?: string;
  showText?: boolean;
}

const PixelBar = ({ value, max, color, label, showText = true }: PixelBarProps) => {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-[8px] text-muted-foreground">{label}</span>
          {showText && (
            <span className="text-[8px] text-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="pixel-border bg-background h-4 relative overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            imageRendering: "pixelated",
          }}
        />
      </div>
    </div>
  );
};

export default PixelBar;
