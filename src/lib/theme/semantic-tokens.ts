// semantic color aliases for consistent ui theming
export const semanticTokens = {
  colors: {
    brand: {
      primary: { value: "{colors.brand.green}" },
      accent: { value: "{colors.brand.greenLight}" },
    },
    ui: {
      text: { value: "black" },
      textMuted: { value: "#666666" },
      textSubtle: { value: "#999999" },
      background: { value: "white" },
      surface: { value: "{colors.brand.surface}" },
      border: { value: "#cccccc" },
      borderLight: { value: "#e0e0e0" },
    },
    status: {
      safe: { value: "#266429" },
      warning: { value: "#856404" }, // wcag aa compliant
      danger: { value: "#C53030" }, // wcag aa compliant
    },
  },
};
