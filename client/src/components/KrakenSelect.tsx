import { useLanguage } from "@/contexts/LanguageContext";
import { WORKFLOW_COLORS } from "@/lib/config";

interface KrakenSelectProps {
  id: string;
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  colorCoded?: boolean;
  disabled?: boolean;
  className?: string;
}

export function KrakenSelect({
  id,
  value,
  options,
  onChange,
  style,
  colorCoded = false,
  disabled = false,
  className = "",
}: KrakenSelectProps) {
  const { t } = useLanguage();

  const bgColor = colorCoded && value && WORKFLOW_COLORS[value] ? WORKFLOW_COLORS[value] : "white";

  return (
    <select
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`kraken-select ${className}`}
      style={{
        width: "250px",
        padding: "4px 8px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        fontSize: "14px",
        backgroundColor: bgColor,
        color: colorCoded && value && ["A", "B"].includes(value) ? "white" : "black",
        ...style,
      }}
    >
      <option value="" style={{ backgroundColor: "white", color: "black" }}>
        {t.noSelection}
      </option>
      {Object.entries(options).map(([key, label]) => (
        <option
          key={key}
          value={key}
          style={{
            backgroundColor: colorCoded && WORKFLOW_COLORS[key] ? WORKFLOW_COLORS[key] : "white",
            color: colorCoded && ["A", "B"].includes(key) ? "white" : "black",
          }}
        >
          {label}
        </option>
      ))}
    </select>
  );
}
