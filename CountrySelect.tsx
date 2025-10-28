"use client";

import * as React from "react";
import {
  Box,
  FormControl,
  OutlinedInput,
  Typography,
  SvgIcon,
  type SvgIconProps,
} from "@mui/material";
import AttachedDropdown from "./AttachedDropdown";

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
  const menuId = `${id}-menu`;

  const handleSelect = (next: string) => {
    onChange(next);
    setOpen(false);
    // Return focus to the field after selection
    anchorNodeRef.current?.focus();
  };

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " " )) {
      e.preventDefault();
      setOpen(true);
      // Focus the first item after open
      requestAnimationFrame(() => {
        const list = document.getElementById(menuId);
        const first = list?.querySelector('[role="menuitem"]') as HTMLElement | null;
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

        <AttachedDropdown
          open={open}
          anchorEl={anchorEl}
          items={COUNTRIES}
          isSelected={(item) => value === item}
          onSelect={(item) => handleSelect(item)}
          onClose={() => setOpen(false)}
          id={menuId}
        />
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
