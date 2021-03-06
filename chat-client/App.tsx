import faker from "faker";
import { Channel } from "phoenix";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import socket from "./src/services/socket";
import Chats from "./src/components/chat/Chats";
import SearchBar from "./src/components/SearchBar";
import Conversations from "./src/components/conversation/Conversations";
import { generateConversationItemProps } from "./src/data/conversation/generateConversationItemProps";

import brands from "./src/styles/brands";

// this enables the uuid in the app
import { RootStackParamList } from "./src/types";
import ConversationScreen from "./src/screens/ConversationScreen";

import "react-native-get-random-values";

const RootStack = createStackNavigator<RootStackParamList>();

function MainNavigation() {
	return (
		<NavigationContainer>
			<RootStack.Navigator
				screenOptions={{
					headerShown: false,
					cardStyle: {
						backgroundColor: brands.colours.white,
					},
				}}
			>
				<RootStack.Screen name="Conversations" component={ConversationScreen} />
				<RootStack.Screen name="Chats" component={Chats} />
			</RootStack.Navigator>
		</NavigationContainer>
	);
}

const App = () => {
	return (
		<SafeAreaProvider>
			<StatusBar style="auto" />
			{/* <AppChildren /> */}
			<MainNavigation />
		</SafeAreaProvider>
	);
};

function AppChildren() {
	// extract this as a custom channel hook
	const chanRef = useRef<Channel>();

	const onSend = useCallback(() => {
		chanRef.current?.push("new_msg", {
			body: {
				text: faker.lorem.words(),
			},
		});
	}, [chanRef]);

	useEffect(() => {
		chanRef.current = socket.channel("conversation:1");
		chanRef.current.join();
		chanRef.current.on("new_msg", console.log);
	}, []);

	return <Chats />;
	// return (
	// 	<View style={styles.container}>
	// 		<StatusBar style="auto" />
	// 		<SearchBar touchable showIcon placeholder="Search..." />
	// <Conversations
	// 	chats={Array(14)
	// 		.fill(0)
	// 		.map((_) => generateConversationItemProps())}
	// />
	// 		<Button title="Send a message" onPress={onSend} />
	// 	</View>
	// );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default App;
