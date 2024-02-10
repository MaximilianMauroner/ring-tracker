import { useEffect, useState } from "react";
import { useDetails } from "../../database/insertion-detail";
import { Insertion } from "../../database/types";
import { Modal, Pressable, Switch, Text, TextInput, View } from "react-native";
import Checkbox from "./Checkbox";
import db from "../../database/sqlite";
import { formatDate, useInsertion } from "../../database/insertions";
import { colors } from "./styling";

const InsertionDetailsModal = ({
    selectedDate,
    selectedInsertion,
    showModal,
    setShowModal,
}: {
    selectedDate: Date;
    selectedInsertion: Insertion | null;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}) => {
    const { detail, getDetail } = useDetails();

    useEffect(() => {
        if (selectedInsertion?.id) {
            getDetail(db, selectedInsertion?.id);
        }
    }, [selectedInsertion]);

    useEffect(() => {
        if (selectedInsertion?.id) {
            getDetail(db, selectedInsertion?.id);
        }
    }, []);
    console.log(detail);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
                setShowModal(!showModal);
            }}
        >
            <CreateDetail
                selectedDate={selectedDate}
                selectedInsertion={selectedInsertion}
                setShowModal={setShowModal}
            />
        </Modal>
    );
};

const CreateDetail = ({
    selectedDate,
    selectedInsertion,
    setShowModal,
}: {
    selectedDate: Date;
    selectedInsertion: Insertion | null;
    setShowModal: (show: boolean) => void;
}) => {
    const [text, onChangeText] = useState("");
    const [rating, setRating] = useState(0);

    const [inserted, setInserted] = useState(
        selectedInsertion?.inserted || false,
    );

    const { addInsertion, updateInsertion } = useInsertion();
    const { addDetail } = useDetails();

    const handleSubmit = () => {
        console.log("inserting");

        if (selectedInsertion) {
            addDetail(db, selectedInsertion?.id, text, rating);
            updateInsertion(db, selectedInsertion?.id, inserted);
        } else {
            addInsertion(db, selectedDate, inserted);
        }
        setShowModal(false);
    };

    return (
        <>
            <View className="relative mx-2 mb-10 mt-auto transform overflow-hidden rounded-lg border border-pink-500 bg-white text-left shadow-xl transition-all">
                <View className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <View className="flex items-start">
                        <View className="mt-3 text-center">
                            <Text
                                className="text-base font-semibold leading-6 text-gray-900"
                                id="modal-title"
                            >
                                {"Date: " + formatDate(selectedDate)}
                            </Text>
                            <View className="flex flex-row items-center justify-between gap-4">
                                <Text
                                    className="text-base font-semibold leading-6 text-gray-900"
                                    id="modal-title"
                                >
                                    {inserted ? "Inserted" : "Not Inserted"}
                                </Text>
                                <Switch
                                    trackColor={{
                                        false: colors.dark,
                                        true: colors.mid,
                                    }}
                                    thumbColor={
                                        inserted ? colors.brand : colors.darkest
                                    }
                                    ios_backgroundColor={colors.darkest}
                                    onValueChange={() => setInserted(!inserted)}
                                    value={inserted}
                                />
                            </View>
                            <View className="col-span-full">
                                <View className="mt-2">
                                    <TextInput
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-pink-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                                        onChange={(e) =>
                                            onChangeText(e.nativeEvent.text)
                                        }
                                        placeholder="Write a few sentences about your day"
                                        value={text}
                                    />
                                </View>
                                <View>
                                    <Text
                                        className="pb-2 text-base font-normal leading-6 text-gray-900"
                                        id="modal-title"
                                    >
                                        {"Rating:"}
                                    </Text>
                                    <View className="flex w-full flex-row justify-between">
                                        {Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <View key={i + 1}>
                                                    <Checkbox
                                                        value={i + 1}
                                                        enabled={
                                                            i + 1 <= rating
                                                        }
                                                        onValueChange={() => {
                                                            if (
                                                                rating ===
                                                                i + 1
                                                            )
                                                                setRating(0);
                                                            else
                                                                setRating(
                                                                    i + 1,
                                                                );
                                                        }}
                                                    />
                                                </View>
                                            ),
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="flex flex-col-reverse gap-4 bg-gray-50 px-4 py-3">
                    <View>
                        <Pressable
                            onPress={() => setShowModal(false)}
                            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                        >
                            <Text className="text-white">Cancel</Text>
                        </Pressable>
                    </View>
                    <View>
                        <Pressable
                            onPress={handleSubmit}
                            className="rounded-md bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
                        >
                            <Text className="text-white">Save</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
};
export default InsertionDetailsModal;
