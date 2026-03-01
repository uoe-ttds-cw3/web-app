import { Box } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/Tooltip";
import { PRODUCT_CODES } from "@/data/PRODUCT_CODES";

export type ProductCodeValueProps = {
  code: string;
  color?: string;
};

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
};

export const ProductCodeValue = ({
  code,
  color = "ui.text",
}: ProductCodeValueProps) => {
  const productCode =
    PRODUCT_CODES[code.toUpperCase() as keyof typeof PRODUCT_CODES];

  if (!productCode) {
    return (
      <Box as="span" color={color}>
        {code}
      </Box>
    );
  }

  return (
    <Tooltip
      content={<Box>Code meaning: {productCode.name}</Box>}
      showArrow
      openDelay={200}
      contentProps={TOOLTIP_PROPS}
    >
      <Box
        as="span"
        color={color}
        cursor="help"
        textDecoration="underline dotted"
        textUnderlineOffset="2px"
      >
        {code}
      </Box>
    </Tooltip>
  );
};
