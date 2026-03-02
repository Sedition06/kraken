/**
 * ColorSelect – Custom dropdown that shows colored option backgrounds
 * when the list is open, unlike native <select> which ignores option
 * background-color in most browsers.
 *
 * Used for Workflow (KAA/KAD/KAI) and other color-coded selects.
 */
import { useEffect, useRef, useState } from "react";
import { WORKFLOW_COLORS } from "@/lib/config";

interface ColorSelectProps {
  id: string;
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
  placeholder?: string;
  colorCoded?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

function getTextColor(bg: string): string {
  // For dark backgrounds (red, green) use white text; otherwise black
  const dark = ["#ff0000", "#008000"];
  return dark.includes(bg.toLowerCase()) ? "#fff" : "#000";
}

export function ColorSelect({
  id,
  value,
  options,
  onChange,
  placeholder = "auswählen...",
  colorCoded = false,
  disabled = false,
  style,
}: ColorSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const selectedBg =
    colorCoded && value && WORKFLOW_COLORS[value]
      ? WORKFLOW_COLORS[value]
      : "#fff";
  const selectedText = colorCoded && value ? getTextColor(selectedBg) : "#000";
  const selectedLabel = value ? options[value] : undefined;

  const baseStyle: React.CSSProperties = {
    width: "250px",
    padding: "4px 28px 4px 8px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: selectedBg,
    color: selectedText,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    userSelect: "none",
    position: "relative",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...style,
  };

  return (
    <div
      ref={ref}
      id={id}
      style={{ position: "relative", display: "inline-block", width: baseStyle.width }}
    >
      {/* Trigger button */}
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        style={baseStyle}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o); }
          if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); }
        }}
      >
        {selectedLabel ?? <span style={{ color: "#888" }}>{placeholder}</span>}
        {/* Chevron */}
        <span
          style={{
            position: "absolute",
            right: "6px",
            top: "50%",
            transform: open ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)",
            pointerEvents: "none",
            fontSize: "10px",
            color: selectedText,
            transition: "transform 0.15s",
          }}
        >
          ▼
        </span>
      </div>

      {/* Dropdown list */}
      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 9999,
            minWidth: "100%",
            border: "1px solid #ced4da",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          {/* Empty / placeholder option */}
          <div
            role="option"
            aria-selected={value === ""}
            style={{
              padding: "5px 10px",
              fontSize: "14px",
              backgroundColor: value === "" ? "#e9ecef" : "#fff",
              color: "#888",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
            onClick={() => { onChange(""); setOpen(false); }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.filter = "brightness(0.93)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.filter = ""; }}
          >
            {placeholder}
          </div>

          {Object.entries(options).map(([key, label]) => {
            const bg = colorCoded && WORKFLOW_COLORS[key] ? WORKFLOW_COLORS[key] : "#fff";
            const fg = colorCoded && WORKFLOW_COLORS[key] ? getTextColor(bg) : "#000";
            const isSelected = key === value;
            return (
              <div
                key={key}
                role="option"
                aria-selected={isSelected}
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                  backgroundColor: isSelected ? (colorCoded && WORKFLOW_COLORS[key] ? bg : "#e9ecef") : bg,
                  color: fg,
                  cursor: "pointer",
                  fontWeight: isSelected ? 600 : 400,
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}
                onClick={() => { onChange(key); setOpen(false); }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.filter = "brightness(0.9)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.filter = ""; }}
              >
                {label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
