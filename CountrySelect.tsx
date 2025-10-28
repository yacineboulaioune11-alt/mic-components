"use client";

import * as React from "react";
import {
  Box,
  ClickAwayListener,
  FormControl,
  ListItemText,
  MenuItem,
  MenuList,
  OutlinedInput,
  Paper,
  Popper,
  Typography,
  SvgIcon,
  type SvgIconProps,
} from "@mui/material";

export type CountrySelectProps = {
  value: string | "";
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  infoMessage?: React.ReactNode; // Optional helper/error content rendered below the field
};

const COUNTRIES: string[] = [
  "Afghanistan",
  "Aland Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Côte d’Ivoire",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Greenland",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const ChevronRightIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </SvgIcon>
);

export default function CountrySelect({
  value,
  onChange,
  label = "Country",
  hint = "You must select your country first before entering the state",
  placeholder = "",
  disabled,
  id = "country-select",
  infoMessage,
}: CountrySelectProps) {
  const labelId = `${id}-label`;
  const helperId = `${id}-helper`;
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const anchorNodeRef = React.useRef<HTMLDivElement | null>(null);
  const setAnchorNode = React.useCallback((node: HTMLDivElement | null) => {
    anchorNodeRef.current = node;
    setAnchorEl(node);
  }, []);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const [menuWidth, setMenuWidth] = React.useState<number | undefined>(undefined);
  const typeBufferRef = React.useRef("");
  const clearTypeTimerRef = React.useRef<number | null>(null);
  const lastKeyPressedRef = React.useRef<string>("");
  // Custom overlay scrollbar state
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [thumbNeeded, setThumbNeeded] = React.useState(false);
  const [thumbVisible, setThumbVisible] = React.useState(false);
  const thumbHideTimerRef = React.useRef<number | null>(null);
  const thumbRef = React.useRef<HTMLDivElement | null>(null);
  const thumbVisibleRef = React.useRef(false);
  const scrollRafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!anchorEl) return;
    const update = () => setMenuWidth(anchorEl.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(anchorEl);
    return () => ro.disconnect();
  }, [anchorEl]);

  const handleSelect = (next: string) => {
    onChange(next);
    setOpen(false);
    // Return focus to the field after selection
    anchorNodeRef.current?.focus();
  };  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " " )) {
      e.preventDefault();
      setOpen(true);
      // Focus the first item after open
      requestAnimationFrame(() => {
        const first = listRef.current?.querySelector('[role="menuitem"]') as HTMLElement | null;
        first?.focus();
      });
      return;
    }
    if (open && e.key === "Escape") {
      e.preventDefault();
  setOpen(false);
  anchorNodeRef.current?.focus();
    }
  };

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

  React.useEffect(() => {
    thumbVisibleRef.current = thumbVisible;
  }, [thumbVisible]);

  const showThumb = React.useCallback((persistMs: number = 2000) => {
    updateThumbMetrics();
    if (!thumbVisibleRef.current) setThumbVisible(true);
    clearThumbHideTimer();
    thumbHideTimerRef.current = window.setTimeout(() => {
      setThumbVisible(false);
      thumbHideTimerRef.current && window.clearTimeout(thumbHideTimerRef.current);
      thumbHideTimerRef.current = null;
    }, persistMs);
  }, [clearThumbHideTimer, updateThumbMetrics]);

  React.useEffect(() => {
    if (!open) return;
    // Update metrics on open and on resize of the scroll container
    const el = scrollContainerRef.current;
    if (!el) return;
    updateThumbMetrics();
    const ro = new ResizeObserver(() => updateThumbMetrics());
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, updateThumbMetrics]);

  const focusItemAtIndex = (index: number) => {
    const items = listRef.current?.querySelectorAll('[role="menuitem"]');
    const el = items?.[index] as HTMLElement | undefined;
    el?.focus();
    el?.scrollIntoView({ block: "nearest" });
  };

  const handleMenuListKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (e) => {
    // Track the last key pressed to prevent Space from triggering click
    lastKeyPressedRef.current = e.key;
    
    // Build a multi-character typeahead buffer including spaces; Enter selects
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
      // Prevent Space from activating the focused MenuItem
      e.preventDefault();
      e.stopPropagation();
      typeBufferRef.current += e.key;
      const query = typeBufferRef.current.toLowerCase();
      const idx = COUNTRIES.findIndex((n) => n.toLowerCase().startsWith(query));
      if (idx >= 0) {
        focusItemAtIndex(idx);
      }
      clearTypeBufferSoon();
    }
  };

  return (
    <Box
      sx={{
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ].join(","),
      }}
    >
      {/* Label line */}
      <Typography id={labelId} sx={{ mb: 0.75 }}>
        <Typography component="span" fontWeight={600}>
          {label}
        </Typography>{" "}
        <Typography component="span" color="text.secondary">
          ({hint})
        </Typography>
      </Typography>

      <FormControl fullWidth disabled={disabled}>
        <Box
          ref={setAnchorNode}
          role="button"
          tabIndex={0}
          aria-haspopup="menu"
          aria-expanded={open ? "true" : undefined}
          aria-labelledby={labelId}
          aria-describedby={infoMessage ? helperId : undefined}
          onClick={() => !disabled && setOpen((v) => !v)}
          onKeyDown={handleKeyDown}
          sx={{ position: "relative", width: "100%" }}
        >
          <OutlinedInput
            readOnly
            fullWidth
            value={value || ""}
            placeholder={placeholder}
            disabled={disabled}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { 
                borderRadius: 2,
                // Square the bottom corners when dropdown is open
                ...(open && {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }),
              },
              borderRadius: 2,
              ...(open && {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }),
              height: 36,
              pl: 1.75,
              pr: 4.5, // space for the chevron
              "& input": {
                padding: 0,
                height: 36,
                lineHeight: "20px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#bdbdbd",
              },
            }}
          />
          <ChevronRightIcon
            sx={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: open 
                ? "translateY(-50%) rotate(-90deg)" // Point up when open
                : "translateY(-50%)", // Point right when closed
              fontSize: 20,
              color: "#1976d2", // Blue color
              pointerEvents: "none",
              transition: "transform 0.05s ease-in-out",
            }}
          />
        </Box>

        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          // Keep it visually attached to the field even when scrolling
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
              // Ignore clicks on the anchor element
              if (anchorNodeRef.current && anchorNodeRef.current.contains(event.target as Node)) return;
              setOpen(false);
            }}
          >
            <Paper
              elevation={0}
              sx={{
                maxHeight: 420,
                width: menuWidth,
                borderRadius: 2,
                // Square the top corners to connect with the input
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                border: "1px solid #e0e0e0",
                // Remove top border to merge with input
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
                    scrollRafRef.current && window.cancelAnimationFrame(scrollRafRef.current);
                    scrollRafRef.current = null;
                    updateThumbMetrics();
                  });
                  showThumb();
                }}
                onWheel={() => showThumb()}
                sx={{
                  maxHeight: 420,
                  overflow: "auto",
                  // Hide native scrollbar entirely; we'll show a custom overlay thumb
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
                  // Use capture to intercept keys like Space before MenuItem handles them
                  onKeyDownCapture={handleMenuListKeyDown}
                >
                  {COUNTRIES.map((name, idx) => (
                    <MenuItem
                      key={name}
                      selected={value === name}
                      onClick={(e) => {
                        // Prevent selection if triggered by Space key (typeahead mode)
                        if (lastKeyPressedRef.current === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        handleSelect(name);
                      }}
                      role="menuitem"
                      // Disable MenuItem's built-in keyboard handling
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
                        borderBottom:
                          idx < COUNTRIES.length - 1 ? "1px solid #f1f1f1" : "none",
                        // Selection and hover states baked-in (from ClientThemeProvider)
                        "&.Mui-selected": {
                          backgroundColor: "rgba(255, 184, 120, 0.25)",
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor: "rgba(255, 184, 120, 0.28)",
                        },
                        // Orange-ish focus/hover when navigating via keyboard
                        "&.Mui-focusVisible": {
                          backgroundColor: "rgba(255, 184, 120, 0.18)",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(255, 184, 120, 0.18)",
                        },
                      }}
                    >
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
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
      </FormControl>

      {infoMessage && (
        <Box
          id={helperId}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 0.75,
            color: "#d32f2f", // default error red; child component can override
            fontSize: 14,
          }}
        >
          {infoMessage}
        </Box>
      )}
    </Box>
  );
}
