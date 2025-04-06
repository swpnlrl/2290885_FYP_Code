import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShown: route.name !== 'home', // Hide header for Home screen
      })}
    />
  );
}