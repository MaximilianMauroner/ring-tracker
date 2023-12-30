import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    AlertIcon,
    AlertText,
    InfoIcon,
    CheckCircleIcon,
    CloseCircleIcon,
    BellIcon,
    AlertCircleIcon,
    VStack,
    Icon,
    Button,
    Center,
    Modal,
    ModalBackdrop,
    ModalContent,
    Heading,
    ModalCloseButton,
    CloseIcon,
    ModalFooter,
    ButtonText,
} from "@gluestack-ui/themed";

import { config } from "@gluestack-ui/config";
import { Box, GluestackUIProvider, Text } from "@gluestack-ui/themed";
import { insert, openDatabase, readInsertions } from "./components/store";
import { Insertion } from "./components/types";
import { Calendar } from "react-native-calendars";
import { colors } from "./components/styling";
import moment from "moment";
import { ModalHeader } from "@gluestack-ui/themed";
import { ModalBody } from "@gluestack-ui/themed";

const db = openDatabase();
export default function App() {
    return (
        <GluestackUIProvider config={config}>
            <Home />
        </GluestackUIProvider>
    );
}
const Home = () => {
    return <MainRing />;
};

const MainRing = () => {
    const [insertions, setInsertions] = useState<Insertion[]>([]);
    const [inserted, setInserted] = useState(false);

    const handleClick = () => {
        insert(db, new Date(), inserted, (Math.random() * 1000).toString());
        setInserted(!inserted);
    };
    const handleInsertions = (insertions: Insertion[]) => {
        console.log("insertions", insertions.length);

        setInsertions(insertions);
    };
    useEffect(() => {
        readInsertions(db, handleInsertions);
    }, [inserted]);

    useEffect(() => {
        readInsertions(db, handleInsertions);
    }, []);

    const lastInsertion = insertions[0] ?? new Date();

    let dateDiff = inserted ? 21 : 7;

    if (lastInsertion) {
        dateDiff -= moment().diff(moment(lastInsertion.date), "days");
    }
    return (
        <Box
            w="$full"
            bg={colors.darkest}
            h="$full"
            alignContent="space-between"
            justifyContent="space-between"
            flex={1}
        >
            <ViewData insertions={insertions} />
            <Center flex={1}>
                <Button
                    bg={inserted ? colors.brand : colors.dark}
                    rounded={"$full"}
                    h={"$80"}
                    w={"$80"}
                    onPress={handleClick}
                >
                    <VStack space="xs" reversed={false}>
                        <Text color="$white" size="3xl" textAlign="center">
                            {inserted ? "Inserted" : "Removed"}
                        </Text>
                        <Text color="$white" size="sm" textAlign="center">
                            {moment(lastInsertion.date).format("DD/MM/YYYY")}
                        </Text>
                        <Text color="$white" size="md" textAlign="center">
                            {`\n${
                                inserted ? "Take out" : "Insert it"
                            } in ${dateDiff} days`}
                        </Text>
                    </VStack>
                </Button>
            </Center>
        </Box>
    );
};

const ViewData = ({ insertions }: { insertions: Insertion[] }) => {
    const [showModal, setShowModal] = useState(false);
    const selected = new Map<string, any>();
    insertions.forEach((insertion) => {
        const date = formatDate(insertion.date);
        if (selected.has(date)) {
            const item = selected.get(date);
            item.customStyles.container.backgroundColor = colors.mid;
        } else {
            selected.set(formatDate(insertion.date), {
                customStyles: {
                    container: {
                        backgroundColor: insertion.inserted
                            ? colors.brand
                            : colors.darkest,
                    },
                    text: {
                        color: "white",
                        fontWeight: "bold",
                    },
                },
                selected: false,
                marked: true,
            });
        }
    });

    return (
        <>
            <DisplayCalendarModal
                insertions={insertions}
                showModal={showModal}
                setShowModal={setShowModal}
            />
            <Calendar
                style={{
                    width: "100%",
                    borderBottomColor: colors.brand,
                    borderBottomWidth: 2,
                    borderColor: colors.brand,
                }}
                enableSwipeMonths={true}
                markingType={"custom"}
                onDayPress={(day) => {
                    console.log(day);

                    setShowModal(true);
                }}
                markedDates={Object.fromEntries(selected)}
            />
        </>
    );
};

function formatDate(date: Date) {
    return moment(date).format("YYYY-MM-DD");
}

const DisplayCalendarModal = ({
    insertions,
    showModal,
    setShowModal,
}: {
    insertions: Insertion[];
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}) => {
    const ref = useRef(null);
    return (
        <Modal
            isOpen={showModal}
            onClose={() => {
                setShowModal(false);
            }}
            finalFocusRef={ref}
        >
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading size="lg">Engage with Modals</Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <Text>
                        Elevate user interactions with our versatile modals.
                        Seamlessly integrate notifications, forms, and media
                        displays. Make an impact effortlessly.
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        action="secondary"
                        mr="$3"
                        onPress={() => {
                            setShowModal(false);
                        }}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                        size="sm"
                        action="positive"
                        borderWidth="$0"
                        onPress={() => {
                            setShowModal(false);
                        }}
                    >
                        <ButtonText>Explore</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
