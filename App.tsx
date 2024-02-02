import React, { useEffect, useRef, useState } from "react";
import { Button, Pressable, Text, View } from "react-native";
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
        <>
            <View>
                <ViewData insertions={insertions} />
                <View className="flex items-center justify-center py-20">
                    <Pressable
                        onTouchEndCapture={handleClick}
                        className={
                            "m-auto flex h-80 w-80 items-center justify-center rounded-full " +
                            (inserted ? "bg-pink-500" : "bg-sky-500")
                        }
                    >
                        <Text>{inserted ? "Inserted" : "Removed"}</Text>
                        <Text>
                            {moment(lastInsertion.date).format("DD/MM/YYYY")}
                        </Text>
                        <Text className="">
                            {`\n${inserted ? "Take out" : "Insert it"} in ${dateDiff} days`}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </>
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
};
