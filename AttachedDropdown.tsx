"use client";

import * as React from "react";
import {
  Box,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  ListItemText,
} from "@mui/material";

export type AttachedDropdownProps<T = string> = {
  open: boolean;
  anchorEl: HTMLElement | null;
  items: T[];
  getKey?: (item: T, index: number) => React.Key;
  getLabel?: (item: T) => string;
  isSelected?: (item: T) => boolean;
  onSelect: (item: T) => void;
  onClose: () => void;
  id?: string; // for a11y ids if needed
};

export default function AttachedDropdown<T = string>({
  open,
  anchorEl,
  items,
  getKey = (_item, idx) => idx,
  getLabel = (item) => String(item),
  isSelected = () => false,
  onSelect,
  onClose,
  id,
}: AttachedDropdownProps<T>) {
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const [menuWidth, setMenuWidth] = React.useState<number | undefined>(undefined);
  const anchorNodeRef = React.useRef<HTMLDivElement | null>(null);
  const setAnchorNode = React.useCallback((node: HTMLDivElement | null) => {
    anchorNodeRef.current = node;
  }, []);

  // Keep width in sync with anchor
  React.useEffect(() => {
    if (!anchorEl) return;
    const update = () => setMenuWidth(anchorEl.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(anchorEl);
    return () => ro.disconnect();
  }, [anchorEl]);

  // Typeahead and keyboard behavior inside the dropdown
  const typeBufferRef = React.useRef("");
  const clearTypeTimerRef = React.useRef<number | null>(null);
  const lastKeyPressedRef = React.useRef<string>("");
  const clearTypeBufferSoon = React.useCallback(() => {
    if (clearTypeTimerRef.current) {
      window.clearTimeout(clearTypeTimerRef.current);
    }
    clearTypeTimerRef.current = window.setTimeout(() => {
      typeBufferRef.current = "";
      if (clearTypeTimerRef.current) {
        window.clearTimeout(clearTypeTimerRef.current);
      }
      clearTypeTimerRef.current = null;
    }, 700);
  }, []);

  const focusItemAtIndex = (index: number) => {
    const itemsEls = listRef.current?.querySelectorAll('[role="menuitem"]');
    const el = itemsEls?.[index] as HTMLElement | undefined;
    el?.focus();
    el?.scrollIntoView({ block: "nearest" });
  };

  const handleMenuListKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (e) => {
    lastKeyPressedRef.current = e.key;

    if (e.key === "Enter") {
      const focused = document.activeElement as HTMLElement | null;
      if (focused && focused.getAttribute("role") === "menuitem") {
        e.preventDefault();
        focused.click();
      }
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      typeBufferRef.current = typeBufferRef.current.slice(0, -1);
      clearTypeBufferSoon();
      return;
    }

    const isChar = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    if (isChar) {
      e.preventDefault();
      e.stopPropagation();
      typeBufferRef.current += e.key;
      const query = typeBufferRef.current.toLowerCase();
      const idx = items.findIndex((it) => getLabel(it).toLowerCase().startsWith(query));
      if (idx >= 0) focusItemAtIndex(idx);
      clearTypeBufferSoon();
    }
  };

  // Custom overlay scroll thumb (no native scrollbar)
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [thumbNeeded, setThumbNeeded] = React.useState(false);
  const [thumbVisible, setThumbVisible] = React.useState(false);
  const thumbRef = React.useRef<HTMLDivElement | null>(null);
  const thumbVisibleRef = React.useRef(false);
  const scrollRafRef = React.useRef<number | null>(null);
  const thumbHideTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    thumbVisibleRef.current = thumbVisible;
  }, [thumbVisible]);

  const updateThumbMetrics = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollHeight, clientHeight, scrollTop } = el;
    if (scrollHeight <= clientHeight + 1) {
      setThumbNeeded(false);
      if (thumbRef.current) {
        thumbRef.current.style.height = '0px';
        thumbRef.current.style.transform = 'translateY(0px)';
      }
      return;
    }
    setThumbNeeded(true);
    const trackHeight = clientHeight;
    const ratio = clientHeight / scrollHeight;
    const minThumb = 24;
    const height = Math.max(minThumb, Math.round(ratio * trackHeight));
    const maxScroll = scrollHeight - clientHeight;
    const maxThumbTop = trackHeight - height;
    const top = Math.round((scrollTop / maxScroll) * maxThumbTop);
    if (thumbRef.current) {
      thumbRef.current.style.height = `${height}px`;
      thumbRef.current.style.transform = `translateY(${top}px)`;
    }
  }, []);

  const clearThumbHideTimer = React.useCallback(() => {
    if (thumbHideTimerRef.current) {
      window.clearTimeout(thumbHideTimerRef.current);
      thumbHideTimerRef.current = null;
    }
  }, []);

  const showThumb = React.useCallback((persistMs: number = 2000) => {
    updateThumbMetrics();
    if (!thumbVisibleRef.current) setThumbVisible(true);
    clearThumbHideTimer();
    thumbHideTimerRef.current = window.setTimeout(() => {
      setThumbVisible(false);
      if (thumbHideTimerRef.current) window.clearTimeout(thumbHideTimerRef.current);
      thumbHideTimerRef.current = null;
    }, persistMs);
  }, [clearThumbHideTimer, updateThumbMetrics]);

  React.useEffect(() => {
    if (!open) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    updateThumbMetrics();
    const ro = new ResizeObserver(() => updateThumbMetrics());
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, updateThumbMetrics]);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      popperOptions={{
        strategy: "fixed",
        modifiers: [
          { name: "offset", options: { offset: [0, 0] } },
          { name: "flip", enabled: false },
          { name: "preventOverflow", enabled: false },
        ],
      }}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
    >
      <ClickAwayListener
        onClickAway={(event) => {
          if (anchorNodeRef.current && anchorNodeRef.current.contains(event.target as Node)) return;
          onClose();
        }}
      >
        <Paper
          elevation={0}
          ref={setAnchorNode}
          sx={{
            maxHeight: 420,
            width: menuWidth,
            borderRadius: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            border: "1px solid #e0e0e0",
            borderTop: "none",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            mt: 0,
            position: "relative",
          }}
        >
          <Box
            ref={scrollContainerRef}
            onScroll={() => {
              if (scrollRafRef.current) return;
              scrollRafRef.current = window.requestAnimationFrame(() => {
                if (scrollRafRef.current) window.cancelAnimationFrame(scrollRafRef.current);
                scrollRafRef.current = null;
                updateThumbMetrics();
              });
              showThumb();
            }}
            onWheel={() => showThumb()}
            sx={{
              maxHeight: 420,
              overflow: "auto",
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <MenuList
              autoFocusItem
              dense
              ref={listRef}
              role="menu"
              onKeyDownCapture={handleMenuListKeyDown}
              id={id}
            >
              {items.map((item, idx) => {
                const key = getKey(item, idx);
                const label = getLabel(item);
                const selected = isSelected(item);
                return (
                  <MenuItem
                    key={key}
                    selected={selected}
                    onClick={(e) => {
                      // Prevent selection if triggered by Space key (typeahead mode)
                      if (lastKeyPressedRef.current === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }
                      onSelect(item);
                    }}
                    role="menuitem"
                    onKeyDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onKeyUp={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    sx={{
                      fontSize: 16,
                      paddingTop: 1,
                      paddingBottom: 1,
                      borderBottom: idx < items.length - 1 ? "1px solid #f1f1f1" : "none",
                      "&.Mui-selected": { backgroundColor: "rgba(255, 184, 120, 0.25)" },
                      "&.Mui-selected:hover": { backgroundColor: "rgba(255, 184, 120, 0.28)" },
                      "&.Mui-focusVisible": { backgroundColor: "rgba(255, 184, 120, 0.18)" },
                      "&:hover": { backgroundColor: "rgba(255, 184, 120, 0.18)" },
                    }}
                  >
                    <ListItemText primary={label} />
                  </MenuItem>
                );
              })}
            </MenuList>
          </Box>

          {thumbNeeded && (
            <Box
              aria-hidden
              ref={thumbRef}
              sx={{
                position: "absolute",
                right: 2,
                top: 0,
                width: 6,
                height: 0,
                borderRadius: 3,
                backgroundColor: "rgba(0,0,0,0.35)",
                opacity: thumbVisible ? 1 : 0,
                transition: "opacity 180ms ease",
                pointerEvents: "none",
                willChange: "transform,height,opacity",
              }}
            />
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
