import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { insert, openDatabase, readInsertions } from "./src/components/store";
import { Insertion } from "./src/components/types";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { colors } from "./src/components/styling";

const db = openDatabase();
const Home = () => {
    return <MainRing />;
};
export default Home;

const MainRing = () => {
    const [insertions, setInsertions] = useState<Insertion[]>([]);
    const [inserted, setInserted] = useState(false);

    const handleClick = () => {
        insert(db, new Date(), inserted, (Math.random() * 1000).toString());
        setInserted(!inserted);
    };
    const handleInsertions = (insertions: Insertion[]) => {
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
    const buttonBgColor =
        dateDiff >= 0
            ? inserted
                ? "bg-pink-500"
                : "bg-sky-500"
            : "bg-red-500";
    return (
        <>
            <View>
                <ViewData insertions={insertions} />
                <View className="flex items-center justify-center py-20">
                    <Pressable
                        onTouchEndCapture={handleClick}
                        className={
                            "m-auto  flex h-80 w-80 items-center justify-center rounded-full " +
                            buttonBgColor
                        }
                    >
                        <Text className="text-lg font-bold text-pink-100">
                            {inserted ? "Inserted" : "Removed"}
                        </Text>
                        <Text className="text-pink-100">
                            {"on the " +
                                moment(lastInsertion.date).format("DD/MM/YYYY")}
                        </Text>
                        <Text
                            className={
                                "p-2 text-2xl font-extrabold text-pink-100"
                            }
                        >
                            {`${inserted ? "Take out" : "Insert it"} in ${dateDiff} days`}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
};

const ViewData = ({ insertions }: { insertions: Insertion[] }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
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

                    setSelectedDate(new Date(day.dateString));
                    setShowModal(true);
                }}
                markedDates={Object.fromEntries(selected)}
            />
            <DisplayCalendarModal
                selectedDate={selectedDate}
                setShowModal={setShowModal}
                showModal={showModal}
            />
        </>
    );
};

function formatDate(date: Date) {
    return moment(date).format("YYYY-MM-DD");
}

const DisplayCalendarModal = ({
    selectedDate,
    showModal,
    setShowModal,
}: {
    selectedDate: Date;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}) => {
    const [text, onChangeText] = useState("Useless Placeholder");
    console.log(selectedDate);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
                setShowModal(!showModal);
            }}
        >
            <View className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <View className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <View className="sm:flex sm:items-start">
                        <View className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"></View>
                        <View className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <Text
                                className="text-base font-semibold leading-6 text-gray-900"
                                id="modal-title"
                            >
                                {formatDate(selectedDate)}
                            </Text>
                            <View className="mt-2">
                                <TextInput
                                    onChangeText={onChangeText}
                                    value={text}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View className="grid grid-cols-2 gap-4 bg-gray-50 px-4 py-3">
                    <View>
                        <Pressable
                            onPress={() => setShowModal(!showModal)}
                            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                        >
                            <Text className="text-white">Cancel</Text>
                        </Pressable>
                    </View>
                    <View>
                        <Pressable
                            onPress={() => setShowModal(!showModal)}
                            className="rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                        >
                            <Text className="text-white">Save</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
