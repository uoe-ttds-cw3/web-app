import { Icon, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import { Tooltip } from "@/components/ui/Tooltip";

export type ManufacturerSearchLinkProps = {
  label: string;
};

const TOOLTIP_PROPS = {
  bg: "ui.background",
  color: "ui.text",
  px: 2,
  py: 1,
  borderRadius: "md",
};

export const ManufacturerSearchLink = ({
  label,
}: ManufacturerSearchLinkProps) => {
  return (
    <Tooltip
      content="Search for more devices from this manufacturer"
      showArrow
      openDelay={200}
      contentProps={TOOLTIP_PROPS}
    >
      <ChakraLink
        asChild
        color="brand.primary"
        textDecoration="underline"
        textUnderlineOffset="2px"
      >
        <Link href={{ pathname: "/", query: { q: label } }}>
          {label} <Icon as={LuSearch} boxSize="3" verticalAlign="middle" />
        </Link>
      </ChakraLink>
    </Tooltip>
  );
};
