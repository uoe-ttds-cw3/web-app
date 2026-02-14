// chakra ui v3 theme system with design tokens
// must merge with defaultConfig to keep all chakra base styles
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { tokens } from "./tokens";
import { semanticTokens } from "./semantic-tokens";

const config = defineConfig({
  theme: {
    tokens,
    semanticTokens,
  },
});

// pass defaultConfig first so chakra's base styles are preserved
export const system = createSystem(defaultConfig, config);
