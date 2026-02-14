import { Box, Text, Link } from "@chakra-ui/react";
import { FaBarcode, FaSearch } from "react-icons/fa";
import { MdNumbers } from "react-icons/md";
import { IoCalendarNumber } from "react-icons/io5";
import { useState } from "react";
import { AdvancedSearchModal } from "../AdvancedSearchModal";

interface FilterMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onFilterSelect: (filterId: string) => void;
    onAdvancedSearch?: (query: string) => void;
}

export const FilterMenu = ({ isOpen, onClose, onFilterSelect, onAdvancedSearch }: FilterMenuProps) => {
    const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
    const filterOptions = [
        {
            id: "submissionNumber",
            title: "Submission Number",
            icon: MdNumbers,
            description: "By Submission No."
        },
        {
            id: "productCode",
            title: "Product Code",
            icon: FaBarcode,
            description: "By Product Code"
        },
        {
            id: "dateBefore",
            title: "Date Before",
            icon: IoCalendarNumber,
            description: "Cleared before date"
        },
        {
            id: "dateAfter",
            title: "Date After",
            icon: IoCalendarNumber,
            description: "Cleared after date"
        },
        {
            id: "advancedSearch",
            title: "Advanced Search",
            icon: FaSearch,
            description: "Search using operators"
        }
    ];

    return (
        <Box
            width="192px"
            background="ui.background"
            borderRadius="6px"
            marginTop="6px"
            padding='4px'
            position="absolute"
            right="0"
            zIndex={10}
            border="1px solid"
            borderColor="ui.borderLight"
            boxShadow="md"
            onClick={onClose}
        >
            {filterOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                    <Link
                        key={option.id}
                        onClick={() => {
                            onFilterSelect(option.id);
                            onClose();
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
                            <IconComponent color="var(--chakra-colors-brand-accent)" style={{ marginRight: "6px", minWidth: "13px" }} />
                            <Box flex="1">
                                <Text fontWeight="500" display="block" fontSize="sm">
                                    {option.title}
                                </Text>
                                <Text fontSize="xs" color="ui.textMuted">
                                    {option.description}
                                </Text>
                            </Box>
                        </Box>
                    </Link>
                );
            })}
        </Box>
    );
};
