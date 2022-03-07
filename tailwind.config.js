const generateGrids = (
  /**
   * The number of grids that are needed to diide a 100% scale
   */
  numberOfGrids = 12
) => {
  const actualGrids = numberOfGrids + 1;
  return new Array(actualGrids).fill(1).reduce((acc, _curr, gridNo) => {
    let key;
    let value;
    if (gridNo === 0) {
      key = 0;
      value = 0;
    } else if (gridNo === numberOfGrids) {
      key = "full";
      value = "100%";
    } else {
      key = `${gridNo}/${numberOfGrids}`;
      value = `${((gridNo * 100) / numberOfGrids).toFixed(4)}%`;
    }
    acc[key] = value;
    return acc;
  }, {});
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          900: "#003b73",
          800: "#0f5792",
          700: "#1967a3",
          600: "#2477b5",
          500: "#2d84c0",
          400: "#4894c8",
          300: "#65a6d0",
          200: "#8dbfde",
          100: "#b8d7eb",
          50: "#e2eff6",
        },
        accent: {
          900: "#880e4f",
          800: "#ad1457",
          700: "#c2185b",
          600: "#d81b60",
          500: "#e91e63",
          400: "#ec407a",
          300: "#f06292",
          200: "#f48fb1",
          100: "#f8bbd0",
          50: "#fce4ec",
        },
        todoist: {
          red: "#e44232",
          gray: "#1e1e1e",
          beige: "#fff9f3",
          30: "#b8256f",
          31: "#db4035",
          32: "#ff9933",
          33: "#fad000",
          34: "#6accbc",
          35: "#7ecc49",
          36: "#299438",
          37: "#6accbc",
          38: "#158fad",
          39: "#14aaf5",
          40: "#96c3eb",
          41: "#4073ff",
          42: "#884dff",
          43: "#af38eb",
          44: "#eb96eb",
          45: "#e05194",
          46: "#ff8d85",
          47: "#808080",
          48: "#b8b8b8",
          49: "#ccac93",
        },
        secondary: "#6c757d",
      },
      transitionProperty: {
        height: "height",
        width: "width",
        size: "width, height",
        "size-space": "width, height, margin, padding",
        spacing: "margin, padding",
      },
      width: generateGrids(),
      minWidth: generateGrids(),
      maxWidth: generateGrids(),
      height: generateGrids(),
      minHeight: generateGrids(),
      maxHeight: generateGrids(),
      screens: {
        "3xl": "2048px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
