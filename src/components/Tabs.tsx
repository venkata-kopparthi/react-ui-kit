import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "../cx";

export type Tab = { id: string; label: string; content: ReactNode; disabled?: boolean };

export type TabsProps = {
  tabs: Tab[];
  label: string;
  defaultTab?: string;
  onChange?: (id: string) => void;
};

export function Tabs({ tabs, label, defaultTab, onChange }: TabsProps) {
  const baseId = useId();
  const firstEnabled = tabs.find((t) => !t.disabled)?.id;
  const [selected, setSelected] = useState(defaultTab ?? firstEnabled);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const enabled = tabs.filter((t) => !t.disabled);

  function select(id: string) {
    setSelected(id);
    refs.current[id]?.focus();
    onChange?.(id);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = enabled.findIndex((t) => t.id === selected);
    let next: Tab | undefined;
    if (e.key === "ArrowRight") next = enabled[(i + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(i - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (next) {
      e.preventDefault();
      select(next.id);
    }
  }

  return (
    <div className="ui-tabs">
      <div role="tablist" aria-label={label} className="ui-tabs__list" onKeyDown={onKeyDown}>
        {tabs.map((t) => {
          const active = t.id === selected;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${t.id}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel-${t.id}`}
              tabIndex={active ? 0 : -1}
              disabled={t.disabled}
              className={cx("ui-tabs__tab", active && "ui-tabs__tab--active")}
              onClick={() => select(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${baseId}-panel-${t.id}`}
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={t.id !== selected}
          tabIndex={0}
          className="ui-tabs__panel"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
