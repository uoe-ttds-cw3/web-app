import { useRouter } from "next/router";
import { Box, Text, Link, Spinner } from "@chakra-ui/react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { useDevice } from "@/lib/queries/useDevice";
import { DeviceDetailed } from "@/features/search/components/DeviceDetailed";

export default function DeviceDetailsPage() {
  const router = useRouter();
  const deviceId = router.query.id as string || '';
  const [showNotFound, setShowNotFound] = useState(false);

  const handleBackToSearch = () => {
    router.back();
  };

  const { data, isLoading, error } = useDevice(deviceId);

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
        <Text color="status.danger" mb="4">
          {error instanceof Error ? error.message : 'Device not found'}
        </Text>
        <Link color="brand.primary" onClick={handleBackToSearch} cursor="pointer">
          &larr; Back to results
        </Link>
      </Box>
    );
  }

  return (
    <Box padding={{ base: "4px", md: "20px" }}>
      <Link
        color="brand.primary"
        mb="4"
        display="inline-block"
        onClick={handleBackToSearch}
        cursor="pointer"
        fontWeight="medium"
      >
        &larr; Back to results
      </Link>
      {data?.device && (
        <DeviceDetailed
          device={data.device}
          lineage={data.lineage}
          safety={data.safety}
        />
      )}
    </Box>
  );
}
