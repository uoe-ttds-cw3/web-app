import { Box, Input, Heading, Text } from "@chakra-ui/react";
import { IoCloseSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

interface AdvancedSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearch?: (query: string) => void;
}

export const AdvancedSearchModal = ({ isOpen, onClose, onSearch }: AdvancedSearchModalProps) => {
    // Boolean AND
    const [andTerm1, setAndTerm1] = useState("");
    const [andTerm2, setAndTerm2] = useState("");

    // Boolean NOT
    const [notTerm1, setNotTerm1] = useState("");
    const [notTerm2, setNotTerm2] = useState("");

    // Phrase Search
    const [phraseTerm, setPhraseTerm] = useState("");

    // Proximity Search
    const [proximityTerm1, setProximityTerm1] = useState("");
    const [proximityDistance, setProximityDistance] = useState("5");
    const [proximityTerm2, setProximityTerm2] = useState("");

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscKey);
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [isOpen, onClose]);

    const handleAndSearch = () => {
        if (andTerm1 && andTerm2) {
            const query = `${andTerm1} AND ${andTerm2}`;
            onSearch?.(query);
            onClose();
            setAndTerm1("");
            setAndTerm2("");
        }
    };

    const handleNotSearch = () => {
        if (notTerm1 && notTerm2) {
            const query = `${notTerm1} NOT ${notTerm2}`;
            onSearch?.(query);
            onClose();
            setNotTerm1("");
            setNotTerm2("");
        }
    };

    const handlePhraseSearch = () => {
        if (phraseTerm) {
            const query = `"${phraseTerm}"`;
            onSearch?.(query);
            onClose();
            setPhraseTerm("");
        }
    };

    const handleProximitySearch = () => {
        if (proximityTerm1 && proximityTerm2) {
            const query = `${proximityTerm1} NEAR/${proximityDistance} ${proximityTerm2}`;
            onSearch?.(query);
            onClose();
            setProximityTerm1("");
            setProximityDistance("5");
            setProximityTerm2("");
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0, 0, 0, 0.5)"
                zIndex={999}
                onClick={onClose}
            />
            <Box
                position="fixed"
                top="40%"
                left="50%"
                transform="translate(-50%, -40%)"
                bg="white"
                borderRadius="12px"
                zIndex={1000}
                width="90%"
                maxWidth="600px"
                onClick={(e) => e.stopPropagation()}
                maxHeight="80vh"
                overflowY="auto"
                padding="25px"
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
                    <Heading size="lg" color="#266429">Advanced Search</Heading>
                    <Box
                        as="button"
                        onClick={onClose}
                        cursor="pointer"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={0}
                        _hover={{ opacity: 0.7 }}
                    >
                        <IoCloseSharp size={24} color="black" />
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={6}>
                    {/* Boolean AND Search */}
                    <Box>
                        <Text fontSize="sm" fontWeight="600" mb={3}>
                            Boolean AND Search
                        </Text>
                        <Box display="flex" alignItems="center" gap={3} mb={1}>
                            <Input
                                placeholder="Term 1"
                                size="md"
                                value={andTerm1}
                                onChange={(e) => setAndTerm1(e.target.value)}
                                padding="10px"
                            />
                            <Text fontWeight="600" whiteSpace="nowrap">AND</Text>
                            <Input
                                placeholder="Term 2"
                                size="md"
                                value={andTerm2}
                                onChange={(e) => setAndTerm2(e.target.value)}
                                padding="10px"
                            />
                            <Box
                                as="button"
                                onClick={handleAndSearch}
                                cursor="pointer"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                _hover={{ opacity: 0.7 }}
                            >
                                <FaSearch size={18} color="black" />
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Text fontSize="xs" color="gray.600">
                                All terms must appear in the results.
                            </Text>
                            <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                                [TERM1 AND TERM2]
                            </Text>
                        </Box>
                    </Box>

                    {/* Boolean NOT Search */}
                    <Box>
                        <Text fontSize="sm" fontWeight="600" mb={3}>
                            Boolean NOT Search
                        </Text>
                        <Box display="flex" alignItems="center" gap={3} mb={1}>
                            <Input
                                placeholder="Term 1"
                                size="md"
                                value={notTerm1}
                                onChange={(e) => setNotTerm1(e.target.value)}
                                padding="10px"
                            />
                            <Text fontWeight="600" whiteSpace="nowrap">NOT</Text>
                            <Input
                                placeholder="Term 2"
                                size="md"
                                value={notTerm2}
                                onChange={(e) => setNotTerm2(e.target.value)}
                                padding="10px"
                            />
                            <Box
                                as="button"
                                onClick={handleNotSearch}
                                cursor="pointer"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                _hover={{ opacity: 0.7 }}
                            >
                                <FaSearch size={18} color="black" />
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Text fontSize="xs" color="gray.600">
                                Find results with first term but exclude the second.
                            </Text>
                            <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                                [TERM1 NOT TERM2]
                            </Text>
                        </Box>
                    </Box>

                    {/* Phrase Search */}
                    <Box>
                        <Text fontSize="sm" fontWeight="600" mb={3}>
                            Phrase Search
                        </Text>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Text fontWeight="600">&ldquo;</Text>
                            <Input
                                placeholder="Enter phrase"
                                size="md"
                                border="none"
                                borderBottom="1px solid"
                                borderColor="gray.300"
                                borderRadius="0"
                                value={phraseTerm}
                                onChange={(e) => setPhraseTerm(e.target.value)}
                            />
                            <Text fontWeight="600">&rdquo;</Text>
                            <Box
                                as="button"
                                onClick={handlePhraseSearch}
                                cursor="pointer"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                _hover={{ opacity: 0.7 }}
                            >
                                <FaSearch size={18} color="black" />
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Text fontSize="xs" color="gray.600">
                                Search for the exact phrase entered.
                            </Text>
                            <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                                [&ldquo;TERM&rdquo;]
                            </Text>
                        </Box>
                    </Box>

                    {/* Proximity Search */}
                    <Box>
                        <Text fontSize="sm" fontWeight="600" mb={3}>
                            Proximity Search
                        </Text>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Input
                                placeholder="Term 1"
                                size="md"
                                value={proximityTerm1}
                                onChange={(e) => setProximityTerm1(e.target.value)}
                                flex={1}
                                padding="10px"
                            />
                            <Text fontWeight="600" whiteSpace="nowrap">NEAR/</Text>
                            <Input
                                placeholder="5"
                                size="md"
                                type="number"
                                value={proximityDistance}
                                onChange={(e) => setProximityDistance(e.target.value)}
                                width="60px"
                                padding="10px"
                            />
                            <Input
                                placeholder="Term 2"
                                size="md"
                                value={proximityTerm2}
                                onChange={(e) => setProximityTerm2(e.target.value)}
                                flex={1}
                                padding="10px"
                            />
                            <Box
                                as="button"
                                onClick={handleProximitySearch}
                                cursor="pointer"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                _hover={{ opacity: 0.7 }}
                            >
                                <FaSearch size={18} color="black" />
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Text fontSize="xs" color="gray.600">
                                Find terms within a specified distance of each other.
                            </Text>
                            <Text fontSize="xs" color="gray.500" fontFamily="monospace">
                                [TERM1 NEAR/distance TERM2]
                            </Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
