import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, Button } from 'react-native';
import axios from 'axios';
import { REST_API_KEY, REDIRECT_URI } from '@env';

const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

export default function KakaoLoginScreen({ navigation }) {
	const getCode = (target) => {
		const exp = 'code=';
		const condition = target.indexOf(exp);
		if (condition !== -1) {
			const requestCode = target.substring(condition + exp.length);
			console.log('code = ', requestCode);
			requestToken(requestCode);
		}
	};

	const requestToken = async (code) => {
		// const requestTokenUrl = 'http://localhost:9090/api/members/kakao/login';
		const requestTokenUrl = 'https://lastdance.kr/api/members/kakao/login';

		try {
			const body = {
				code,
			};
			const response = await axios.post(requestTokenUrl, body);

			console.log(response.headers);

			const accessToken = response.headers['authorization'];
			const refreshToken = response.headers['authorization-refresh'];

			if (accessToken) {
				// AsyncStorage에 accessToken 저장
				await AsyncStorage.setItem('accessToken', accessToken);
			}

			if (refreshToken) {
				// AsyncStorage에 refreshToken 저장
				await AsyncStorage.setItem('refreshToken', refreshToken);
			}

			console.log(response.data);

			await navigation.navigate('가족선택');
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<WebView
				style={{ flex: 1 }}
				source={{
					uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=https://auth.expo.io/@hyeongseoklee/zip-app/auth/kakao/callback`,
				}}
				injectedJavaScript={INJECTED_JAVASCRIPT}
				javaScriptEnabled
				onMessage={(event) => {
					const data = event.nativeEvent.url;
					getCode(data);
				}}
			/>
		</View>
	);
}
