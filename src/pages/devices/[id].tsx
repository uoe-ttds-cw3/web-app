import { useRouter } from "next/router";
import { Box, Text, Link, Spinner } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { getSearchResultsHref } from "@/lib/navigation";
import { useDevice } from "@/lib/queries/useDevice";
import { DeviceDetailed } from "@/features/search/components/DeviceDetailed";
import { DEVICE_DETAIL_MAX_W } from "@/features/search/components/DeviceDetailed/DeviceDetailCard";

export default function DeviceDetailsPage() {
  const router = useRouter();
  const deviceId = (router.query.id as string) || "";
  const searchResultsHref = getSearchResultsHref(router.query.returnTo);
  const backLinkHref = searchResultsHref ?? "/";
  const backLinkLabel = searchResultsHref ? "Back to results" : "Back to search";
  const [showNotFound, setShowNotFound] = useState(false);

  const { data, isLoading, error } = useDevice(deviceId);

  // track device view when data loads
  useEffect(() => {
    if (data?.device && deviceId) {
      posthog.capture("device_viewed", {
        device_id: deviceId,
        device_name: data.device.device_name,
        product_code: data.device.product_code,
        manufacturer: data.device.sponsor,
        has_recalls: data.safety?.recall_count
          ? data.safety.recall_count > 0
          : false,
      });
    }
  }, [data, deviceId]);

  // delayed not-found: wait 1s after loading completes before showing error
  useEffect(() => {
    if (!isLoading && (error || !data?.device)) {
      const timer = setTimeout(() => {
        setShowNotFound(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowNotFound(false);
    }
  }, [isLoading, error, data]);

  if (isLoading) {
    return (
      <Box textAlign="center" padding="40px">
        <Spinner size="lg" color="brand.accent" />
        <Text mt="4">Loading device details...</Text>
      </Box>
    );
  }

  if (showNotFound) {
    return (
      <Box padding="20px">
        <Box maxW={DEVICE_DETAIL_MAX_W} mx="auto">
          <Text color="status.danger" mb="4">
            {error instanceof Error ? error.message : "Device not found"}
          </Text>
          <Link
            asChild
            color="brand.primary"
            cursor="pointer"
            fontSize="md"
          >
            <NextLink href={backLinkHref}>&larr; {backLinkLabel}</NextLink>
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <Box padding={{ base: "12px", md: "20px" }}>
      <Box maxW={DEVICE_DETAIL_MAX_W} mx="auto">
        <Link
          asChild
          color="brand.primary"
          mb="4"
          display="inline-block"
          cursor="pointer"
          fontWeight="medium"
          fontSize="md"
        >
          <NextLink href={backLinkHref}>&larr; {backLinkLabel}</NextLink>
        </Link>
        {data?.device && (
          <DeviceDetailed
            device={data.device}
            lineage={data.lineage}
            safety={data.safety}
            deviceSafety={data.deviceSafety ?? null}
          />
        )}
      </Box>
    </Box>
  );
}
