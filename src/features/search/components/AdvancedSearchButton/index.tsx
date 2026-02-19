import { Box, Text, Link, Flex } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

interface FilterMenuProps {
    isOpen: boolean;
    onAdvancedSearchToggle: () => void;
}

export const AdvancedSearchButton = ({ isOpen, onAdvancedSearchToggle }: FilterMenuProps) => {
    const IconComponent = FaSearch;
    const id = "advancedSearch";
    const title = "Advanced Search";
    const description = "Search using operators";
    return (
            <Box
                width="320px"
                height = "35px"
                background="ui.background"
                borderRadius="6px"
                marginTop="6px"
                position="absolute"
                left="0"
                zIndex={10}
                border="1px solid"
                borderColor="ui.borderLight"
                boxShadow="md"
            >
                <Link
                    key={id}
                    onMouseDown={() => {
                        onAdvancedSearchToggle();
                    }}
                    display="block"
                    width="100%"
                    padding="6px"
                    borderRadius="6px"
                    _hover={{
                        bg: "ui.surface",
                        textDecoration: "none",
                    }}
                    cursor="pointer"
                >
                    <Box display="flex" alignItems="center" gap="6px">
                        <IconComponent color="var(--chakra-colors-brand-accent)" style={{ marginLeft: "10px", marginRight: "6px", minWidth: "13px" }} />
                        <Box flex="1">
                            <Flex align="baseline" gap={2}>
                            <Text fontWeight="500" fontSize="sm">
                                {title}
                            </Text>
                            <Text fontSize="xs" color="ui.textMuted">
                                {description}
                            </Text>
                            </Flex>
                        </Box>
                    </Box>
                </Link>
            </Box>
    )
}