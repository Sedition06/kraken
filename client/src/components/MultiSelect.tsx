import { useLanguage } from "@/contexts/LanguageContext";

interface MultiSelectProps {
  id: string;
  value: string[];
  options: Record<string, string>;
  onChange: (value: string[]) => void;
  style?: React.CSSProperties;
}

export function MultiSelect({ id, value, options, onChange, style }: MultiSelectProps) {
  const { t } = useLanguage();
  const sortedEntries = Object.entries(options).sort(([a], [b]) => a.localeCompare(b));

  return (
    <select
      id={id}
      name={id}
      multiple
      value={value}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
        onChange(selected);
      }}
      style={{
        width: "250px",
        height: "120px",
        padding: "4px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        fontSize: "13px",
        ...style,
      }}
    >
      {sortedEntries.map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
}
