import moment from "moment";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import InsertionDetailsModal from "./components/InsertionDetailsModal";
import { colors } from "./components/styling";
import useInsertions from "../database/insertions";
import db from "../database/sqlite";
import { Insertion } from "../database/types";
import { formatDate } from "../database/helpers";
const HomeScreen = () => {
    const [inserted, setInserted] = useState(false);
    const store = useInsertions();
    const handleCircleClick = () => {
        store.add(new Date(), inserted);
        setInserted(!inserted);
    };

    const lastInsertion = store.insertions[0] ?? new Date();

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
                <ViewData />
                <View className="flex items-center justify-center py-20">
                    <Pressable
                        onTouchEndCapture={handleCircleClick}
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
                        <Text className="p-2 text-2xl font-extrabold text-pink-100">
                            {`${inserted ? "Take out" : "Insert it"} in ${dateDiff} days`}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
};
export default HomeScreen;

const ViewData = () => {
    const store = useInsertions();
    console.log(store.insertions);

    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [usedDates, setUsedDates] = useState<Map<string, any>>(
        new Map<string, any>(),
    );

    const [selectedInsertion, setSelectedInsertion] =
        useState<Insertion | null>(null);

    const updateUsedDates = () => {
        store.insertions.forEach((insertion) => {
            usedDates.set(formatDate(insertion.date), {
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
        });
        setUsedDates(new Map(usedDates));
    };
    useEffect(() => {
        updateUsedDates();
    }, [store.insertions]);
    useEffect(() => {
        updateUsedDates();
    }, []);

    return (
        <>
            <Calendar
                style={{
                    width: "100%",
                    borderBottomColor: colors.brand,
                    borderBottomWidth: 2,
                    borderColor: colors.brand,
                }}
                enableSwipeMonths
                markingType="custom"
                onDayPress={(day) => {
                    const d = new Date(day.dateString);

                    setSelectedInsertion(
                        store.insertions.find(
                            (i) => formatDate(i.date) === formatDate(d),
                        ) || null,
                    );
                    setSelectedDate(d);
                    setShowModal(true);
                }}
                markedDates={Object.fromEntries(usedDates)}
            />
            <InsertionDetailsModal
                key={selectedDate.toString()}
                selectedDate={selectedDate}
                selectedInsertion={selectedInsertion}
                showModal={showModal}
                setShowModal={setShowModal}
            />
        </>
    );
};
