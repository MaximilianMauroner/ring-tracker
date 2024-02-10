import { useEffect, useState } from "react";
import { Insertion } from "../database/types";
import moment from "moment";
import { Pressable, Text, View } from "react-native";
import { colors } from "./components/styling";
import { Calendar } from "react-native-calendars";
import { formatDate, useInsertion } from "../database/insertions";
import db from "../database/sqlite";
import InsertionDetailsModal from "./components/InsertionDetailsModal";
const HomeScreen = () => {
    const [inserted, setInserted] = useState(false);
    const { insertions, getInsertions, addInsertion } = useInsertion();

    const handleCircleClick = () => {
        addInsertion(db, new Date(), inserted);
        setInserted(!inserted);
    };
    useEffect(() => {
        getInsertions(db);
    }, [inserted]);

    useEffect(() => {
        getInsertions(db);
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
export default HomeScreen;

const ViewData = ({ insertions }: { insertions: Insertion[] }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedInsertion, setSelectedInsertion] =
        useState<Insertion | null>(null);
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
                    const d = new Date(day.dateString);

                    setSelectedInsertion(
                        insertions.find(
                            (i) => formatDate(i.date) === formatDate(d),
                        ) || null,
                    );
                    setSelectedDate(d);
                    setShowModal(true);
                }}
                markedDates={Object.fromEntries(selected)}
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
