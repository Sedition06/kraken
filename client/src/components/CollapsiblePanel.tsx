import { useState, type ReactNode } from "react";

interface CollapsiblePanelProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  id: string;
}

export function CollapsiblePanel({ title, children, defaultOpen = true, id }: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <table
      className="kraken-panel"
      style={{
        width: "875px",
        borderCollapse: "collapse",
        marginBottom: "2px",
        borderBottom: "1px solid #dee2e6",
      }}
    >
      <thead>
        <tr>
          <th
            colSpan={4}
            onClick={() => setOpen(!open)}
            style={{
              cursor: "pointer",
              backgroundColor: "#f8d7da",
              padding: "8px 12px",
              textAlign: "left",
              userSelect: "none",
            }}
            id={id}
          >
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 500 }}>
              {open ? "▼" : "▶"} {title}
            </h3>
          </th>
        </tr>
      </thead>
      {open && (
        <tbody
          style={{ backgroundColor: "#f8d7da" }}
        >
          {children}
        </tbody>
      )}
    </table>
  );
}
