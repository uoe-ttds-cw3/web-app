import { useRouter } from "next/router";
import { useEffect } from "react";
import {DeviceSummaryCard, Device} from "@/features/search/components/DeviceSummaryCard";
import { ResultsHeader } from "@/features/search/components/ResultsHeader";
import { NavBar } from "@/features/search/components/NavBar";
import { SearchForm } from "@/features/search/components/SearchForm";
import { StartSearching } from "@/features/search/components/StartSearching";
import { Stack, Text, Box, Spinner } from "@chakra-ui/react";
import { useSearch } from "@/lib/queries/useSearch";
import { transformSearchResult } from "@/lib/api/types";
import { toaster } from "@/components/ui/Toaster";
import { SideDrawer } from "@/features/search/components/SideDrawer";
import { useState } from "react";
import { FullBleed } from "@/components/ui/FullBleed";

export default function Home() {
  const router = useRouter();
  const query = (router.query.q as string) || '';
  const panel = (router.query.panel as string) || undefined;
  const productCode = (router.query.product_code as string) || undefined;
  const dateBefore = (router.query.date_to as string) || undefined;
  const dateAfter = (router.query.date_from as string) || undefined;

  const { data, isFetching, isLoading, error } = useSearch(query, { panel, product_code: productCode, date_from: dateAfter, date_to: dateBefore, limit: 20 });
  const results = data?.results.map(transformSearchResult) ?? [];
  
  // Manage use state for selected devices for comparison - lifted up to home page to persist across navigation to device detailed page and back, and to pass to side drawer component
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);

  const handleToggle = (device: Device) => {
    setSelectedDevices(prev => {
      const exists = prev.some(d => d.id === device.id);
      return exists ? prev.filter(d => d.id !== device.id) : [...prev, device];
    });
  };

  // Show error toast when search fails
  useEffect(() => {
    if (error) {
      toaster.create({
        title: "Search failed",
        description: error instanceof Error ? error.message : 'Failed to fetch search results',
        type: "error",
        duration: Infinity, // Persist until dismissed
      });
    }
  }, [error]);

  const convertDateFormat = (ddmmyyyy: string): string => {
    const [day, month, year] = ddmmyyyy.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleSearch = (newQuery: string, tags?: Array<{ id: string; type: string; value: string }>) => {
    const queryParams: Record<string, string> = { q: newQuery };

    if (tags) {
      tags.forEach(tag => {
        if (tag.value) {
          if (tag.type === "Product Code") {
            queryParams.product_code = tag.value;
          } else if (tag.type === "Before") {
            queryParams.date_to = convertDateFormat(tag.value);
          } else if (tag.type === "After") {
            queryParams.date_from = convertDateFormat(tag.value);
          }
        }
      });
    }

    if (panel) {
      queryParams.panel = panel;
    }

    router.push({
      pathname: '/',
      query: queryParams
    }, undefined, { shallow: true });
  };

  const handleCategorySelect = (panelCode?: string) => {
    if (panelCode) {
      router.push({
        pathname: '/',
        query: { ...router.query, panel: panelCode }
      }, undefined, { shallow: true });
    } else {
      const { panel: _removed, ...rest } = router.query;
      router.push({
        pathname: '/',
        query: rest
      }, undefined, { shallow: true });
    }
  };

  // Show "Start Searching" when no query
  if (!query && results.length === 0) {
    return (
      <div>
        <SearchForm onSearch={handleSearch} initialQuery={query} />
        <NavBar
          selectedCategory={panel}
          onCategorySelect={handleCategorySelect}
        />
        <StartSearching onSuggest={handleSearch} />
      </div>
    );
  }

  return (
    <div>
      <SearchForm onSearch={handleSearch} initialQuery={query} />
      <NavBar
        selectedCategory={panel}
        onCategorySelect={handleCategorySelect}
      />

      {/* First load - centered spinner */}
      {isLoading && (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" padding="40px">
          <Spinner size="lg" color="#266429" />
          <Text color="#266429" marginTop="16px" fontSize="lg">Searching...</Text>
        </Box>
      )}

      {/* Results with loading overlay */}
      {data && (
        <Box position="relative" p={6} maxW="100%" w="100%">
          {/* Loading overlay on top of stale results */}
          {isFetching && (
            <Box
              position="absolute"
              inset="0"
              bg="whiteAlpha.700"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex="5"
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Spinner size="lg" color="#266429" />
                <Text color="#266429" marginTop="16px" fontSize="lg">Searching...</Text>
              </Box>
            </Box>
          )}

          {/* Empty results state */}
          {data.results.length === 0 ? (
            <Box textAlign="center" padding="40px" color="#666">
              <Text fontSize="lg" fontWeight="bold" color="#266429" mb="2">
                No results found for &quot;{query}&quot;
              </Text>
              <Text mb="4">Try a different search term:</Text>
              <Box display="flex" gap="8px" justifyContent="center" flexWrap="wrap">
                {["insulin pump", "pacemaker", "catheter", "hip implant", "blood pressure"].map((suggestion) => (
                  <Box
                    key={suggestion}
                    as="button"
                    onClick={() => handleSearch(suggestion)}
                    padding="6px 16px"
                    borderRadius="20px"
                    backgroundColor="#4CAF5020"
                    color="#266429"
                    fontSize="sm"
                    cursor="pointer"
                    _hover={{ backgroundColor: "#4CAF5040" }}
                  >
                    {suggestion}
                  </Box>
                ))}
              </Box>
              
            </Box>
          ) : (
            <>
            <FullBleed p={4}>
            <Box display="flex" minH="100vh" p="4">
             {/* Left sidebar */}
               <Box w="200px" flexShrink={0} p={4}>
                {/*<LeftSidebar />*/}
               </Box>

            {/* Main content */}   
            <Box flex="1">
              <ResultsHeader numResults={data.total_results} />
              <Stack>
                {results.map((device) => (
                  <DeviceSummaryCard key={device.id} device={device} selectedDevices={selectedDevices} onToggle={handleToggle} />
                ))}
              </Stack>             
            </Box>

            {/* Right sidebar */}
            <Box w="200px" flexShrink={0} p="4">
              <SideDrawer selectedDeviceIds={selectedDevices.map(d => d.id)} />
            </Box>
          </Box> 

          </FullBleed>
          </>
           )}
           </Box>
         )}
       </div>
  );
}
