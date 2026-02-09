import { Box, Text, Link } from "@chakra-ui/react";
import { FaTags, FaBarcode } from "react-icons/fa";

interface FilterMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onFilterSelect: (filterId: string) => void;
}

export const FilterMenu = ({ isOpen, onClose, onFilterSelect }: FilterMenuProps) => {
    const filterOptions = [
        {
            id: "category",
            title: "Category",
            icon: FaTags,
            description: "From a specific category"
        },
        {
            id: "productCode",
            title: "Product Code",
            icon: FaBarcode,
            description: "Search by Product Code"
        }
    ];

    if (!isOpen) return null;

    return (
        <Box
            width="192px"
            background="#FFFFFFFF"
            borderRadius="6px"
            marginTop="6px"
            padding='4px'
            position="absolute"
            right="0"
            zIndex={10}
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
                            bg: "#00000011",
                            textDecoration: "none",
                        }}
                        cursor="pointer"
                    >
                        <Box display="flex" alignItems="center" gap="6px">
                            <IconComponent color="#4CAF50" style={{ marginRight: "6px", minWidth: "13px" }} />
                            <Box flex="1">
                                <Text fontWeight="500" display="block" fontSize="sm">
                                    {option.title}
                                </Text>
                                <Text fontSize="xs" color="#666">
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
