import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../HomeScreen';
import IntroScreen from '../IntroScreen';
import LoginScreen from '../auth/LoginScreen';
import SelectScreen from '../SelectScreen';
import KakaoLoginScreen from '../auth/KakaoLoginScreen';
import KakaoLoginCallBack from '../auth/KakaoLoginCallBack';

const Stack = createStackNavigator();

export default function StackNavigator() {
	return (
		<Stack.Navigator initialRouteName="홈">
			<Stack.Screen
				name="홈"
				component={HomeScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="진입화면"
				component={IntroScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="로그인"
				component={LoginScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="가족선택"
				component={SelectScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="카카오"
				component={KakaoLoginScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="/auth/kakao/callback"
				component={KakaoLoginCallBack}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}