import { Box, Input, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

const DATEBOX_QUERY_KEY = "snapshot_cutoff";
const DATEBOX_STORAGE_KEY = "snapshot_cutoff";

export const DateBox = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
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
      cursor="pointer"
      onClick={() => {
        inputRef.current?.showPicker?.();
        inputRef.current?.focus();
      }}
    >
      <Icon
        as={FaRegCalendarAlt}
        color="brand.primary"
        boxSize="4"
        flexShrink={0}
      />
      <Input
        ref={inputRef}
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
        css={{
          "&::-webkit-calendar-picker-indicator": {
            opacity: 0,
            display: "none",
            pointerEvents: "none",
          },
          "&::-webkit-clear-button": {
            display: "none",
          },
        }}
      />
    </Box>
  );
};
