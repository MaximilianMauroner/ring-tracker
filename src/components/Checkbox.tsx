import { Pressable, Text, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { colors } from "./styling";

export default function Checkbox({
    value,
    enabled,
    onValueChange,
}: {
    value: number;
    enabled: boolean;
    onValueChange: () => void;
}) {
    return (
        <Pressable onPress={onValueChange}>
            <MoodIcons enabled={enabled} value={value} />
        </Pressable>
    );
}

const MoodIcons = ({ value, enabled }: { value: number; enabled: boolean }) => {
    let color = enabled ? "bg-pink-500" : "bg-sky-500";
    return (
        <View
            className={`flex h-5 w-5 items-center justify-center rounded-full ${color}`}
        >
            <Text className="text-white">{value}</Text>
        </View>
    );
};
