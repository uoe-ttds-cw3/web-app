import { useRouter } from "next/router";
import { Box, Text, Link, Spinner } from "@chakra-ui/react";
import NextLink from "next/link";
import { useDevice } from "@/lib/queries/useDevice";
import { DeviceDetailed } from "@/features/search/components/DeviceDetailed";

export default function DeviceDetailsPage() {
  const router = useRouter();
  const deviceId = router.query.id as string || '';

  const handleBackToSearch = () => {
    router.back();
  };

  const { data, isLoading, error } = useDevice(deviceId);

  if (isLoading) {
    return (
      <Box textAlign="center" padding="40px">
        <Spinner size="lg" color="#4CAF50" />
        <Text mt="4">Loading device details...</Text>
      </Box>
    );
  }

  if (error || !data?.device) {
    return (
      <Box padding="20px">
        <Text color="red.500" mb="4">
          {error instanceof Error ? error.message : 'Device not found'}
        </Text>
        <Link color="#266429" onClick={handleBackToSearch} cursor="pointer">
          Back to search
        </Link>
      </Box>
    );
  }

  return (
    <Box padding="20px">
      <Link color="#266429" mb="4" display="inline-block" onClick={handleBackToSearch} cursor="pointer">
        &larr; Back to search
      </Link>
      <DeviceDetailed
        device={data.device}
        lineage={data.lineage}
        safety={data.safety}
      />
    </Box>
  );
}
