import { Box } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/Tooltip";
import { PRODUCT_CODES } from "@/data/PRODUCT_CODES";

export type ProductCodeValueProps = {
  code: string;
};

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
};

export const ProductCodeValue = ({ code }: ProductCodeValueProps) => {
  const productCode =
    PRODUCT_CODES[code.toUpperCase() as keyof typeof PRODUCT_CODES];

  if (!productCode) {
    return (
      <Box as="span" color="ui.text">
        {code}
      </Box>
    );
  }

  return (
    <Tooltip
      content={<Box fontWeight="semibold">{productCode.name}</Box>}
      showArrow
      openDelay={200}
      contentProps={TOOLTIP_PROPS}
    >
      <Box
        as="span"
        color="ui.text"
        cursor="help"
        textDecoration="underline dotted"
        textUnderlineOffset="2px"
      >
        {code}
      </Box>
    </Tooltip>
  );
};
