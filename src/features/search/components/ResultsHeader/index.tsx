import { NativeSelect, Flex, Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface ResultsHeaderProps {
    numResults: number;
}


export const ResultsHeader = ({numResults = 0}: ResultsHeaderProps) => {
    const [sort, setValue] = useState("default")

    return (
        <Box
            paddingBottom="16px"  
            color="#266429"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
        >
            <Text display="inline-flex" alignItems="center">
                <FaSearch color="#4CAF50" style={{ marginRight: "8px" }} />
                Found {numResults == 0 ? "no" : numResults} device{numResults==1 ? "" : "s"}...
            </Text>
            <Box>
                <NativeSelect.Root width="190px" borderRadius="8px" border="none">
                <NativeSelect.Field 
                    textAlign="right" 
                    paddingRight="30px"
                    border="none"
                    value={sort}
                    onChange={(e) => setValue(e.currentTarget.value)}
                >
                    <option value="default">Default</option>
                    <option value="pagerank">Pagerank boost</option>
                    <option value="date">Date</option>
                    <option value="length">Documentation length</option>
                    <option value="links">Number of linked devices</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
                </NativeSelect.Root>
            </Box>
        </Box>
    );
};
