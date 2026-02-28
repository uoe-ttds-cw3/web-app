import { Box, Input, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Tooltip } from "@/components/ui/Tooltip";

const DATEBOX_QUERY_KEY = "snapshot_cutoff";
const DATEBOX_STORAGE_KEY = "snapshot_cutoff";

export const DateBox = () => {
  const router = useRouter();
  const value = (router.query[DATEBOX_QUERY_KEY] as string) || "";
  const today = new Date().toISOString().split("T")[0];

  const handleDateChange = useCallback(
    (nextValue: string) => {
      const rest: Record<string, string | string[] | undefined> = {
        ...router.query,
      };
      delete rest.page;
      // don't carry over dynamic route params from other pages (e.g. /devices/[id])
      delete rest.id;

      if (!nextValue) {
        const remaining = { ...rest };
        delete remaining[DATEBOX_QUERY_KEY];
        router.push(
          {
            pathname: "/",
            query: remaining,
          },
          undefined,
          { shallow: true },
        );
        return;
      }

      router.push(
        {
          pathname: "/",
          query: {
            ...rest,
            [DATEBOX_QUERY_KEY]: nextValue,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  useEffect(() => {
    if (!router.isReady) return;
    // only auto-restore snapshot date on the search page, not device detail etc.
    if (router.pathname !== "/") return;

    if (value) {
      localStorage.setItem(DATEBOX_STORAGE_KEY, value);
      return;
    }

    const storedDate = localStorage.getItem(DATEBOX_STORAGE_KEY);
    if (!storedDate) return;

    if (storedDate > today) {
      localStorage.removeItem(DATEBOX_STORAGE_KEY);
      return;
    }

    handleDateChange(storedDate);
  }, [router.isReady, router.pathname, value, today, handleDateChange]);

  return (
    <Tooltip
      content="Explore a historical snapshot of the dataset up to the selected date."
      contentProps={{
        px: "12px",
        py: "10px",
        borderRadius: "12px",
        bg: "ui.surface",
        color: "ui.text",
        border: "1px solid",
        borderColor: "ui.borderLight",
        boxShadow: "md",
        maxW: "260px",
        fontSize: "sm",
        lineHeight: "1.4",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap="8px"
        backgroundColor="ui.background"
        borderRadius="8px"
        paddingX="12px"
        height="44px"
        border="1px solid"
        borderColor="ui.borderLight"
        minW="170px"
        flexShrink={0}
      >
        <Icon
          as={FaRegCalendarAlt}
          color="brand.primary"
          boxSize="4"
          flexShrink={0}
        />
        <Input
          type="date"
          value={value}
          max={today}
          onChange={(e) => {
            const nextValue = e.target.value;
            if (nextValue) {
              localStorage.setItem(DATEBOX_STORAGE_KEY, nextValue);
            } else {
              localStorage.removeItem(DATEBOX_STORAGE_KEY);
            }
            handleDateChange(nextValue);
          }}
          border="none"
          padding="0"
          height="100%"
          fontSize="sm"
          _focus={{ boxShadow: "none", outline: "none" }}
        />
      </Box>
    </Tooltip>
  );
};
