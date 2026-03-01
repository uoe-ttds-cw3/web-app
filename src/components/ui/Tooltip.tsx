import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import * as React from "react";

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
}

const toCssVarReference = (value: string) => {
  if (
    value.startsWith("var(") ||
    value.startsWith("#") ||
    value.startsWith("rgb(") ||
    value.startsWith("rgba(") ||
    value.startsWith("hsl(") ||
    value.startsWith("hsla(")
  ) {
    return value;
  }

  return `var(--chakra-colors-${value.replace(/\./g, "-")})`;
};

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props;
    const tooltipBg = contentProps?.bg ?? contentProps?.backgroundColor;
    const tooltipBgVar =
      typeof tooltipBg === "string" ? toCssVarReference(tooltipBg) : undefined;
    const mergedContentProps = tooltipBg
      ? {
          ...contentProps,
          bg: tooltipBg,
          "--tooltip-bg": tooltipBgVar ?? tooltipBg,
          "--arrow-background": tooltipBgVar ?? tooltipBg,
        }
      : contentProps;

    if (disabled) return children;

    return (
      <ChakraTooltip.Root {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ref} {...mergedContentProps}>
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    );
  }
);
