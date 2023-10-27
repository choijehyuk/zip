import { useRef, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Modal,
	Animated,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Dimensions,
	PanResponder,
} from 'react-native';

export default function SchedulePreview(props) {
	const { modalVisible, setModalVisible, selectedDate, navigation } = props;
	const screenHeight = Dimensions.get('screen').height;
	const panY = useRef(new Animated.Value(screenHeight)).current;
	const translateY = panY.interpolate({
		inputRange: [-1, 0, 1],
		outputRange: [0, 0, 1],
	});

	const resetSchedulePreview = Animated.timing(panY, {
		toValue: 0,
		duration: 300,
		useNativeDriver: true,
	});

	const closeSchedulePreview = Animated.timing(panY, {
		toValue: screenHeight,
		duration: 300,
		useNativeDriver: true,
	});

	const panResponders = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => false,
			onPanResponderMove: (event, gestureState) => {
				panY.setValue(gestureState.dy);
			},
			onPanResponderRelease: (event, gestureState) => {
				if (gestureState.dy > 0 && gestureState.vy > 1.5) {
					closeModal();
				} else {
					resetSchedulePreview.start();
				}
			},
		}),
	).current;

	useEffect(() => {
		if (props.modalVisible) {
			resetSchedulePreview.start();
		} else {
			closeSchedulePreview.start();
		}
	}, [props.modalVisible]);

	const closeModal = () => {
		closeSchedulePreview.start(() => {
			setModalVisible(false);
		});
	};

	return (
		<Modal
			visible={modalVisible}
			animationType={'fade'}
			transparent
			statusBarTranslucent
		>
			<View style={styles.overlay}>
				<TouchableWithoutFeedback onPress={closeModal}>
					<View style={styles.background} />
				</TouchableWithoutFeedback>
				<Animated.View
					style={{
						...styles.bottomSheetContainer,
						transform: [{ translateY: translateY }],
					}}
					{...panResponders.panHandlers}
				>
					{/* 일정 미리보기  */}
					<View style={styles.previewHeader}>
						<Text style={styles.previewDateFont}>
							{selectedDate.split('-')[2]}
						</Text>
						<Text style={styles.dateUnitFont}>일</Text>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('일정', {
									dateInfo: selectedDate,
								});
							}}
						>
							<Text>자세히 보기</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.previewContent}>
						<View>
							<Text style={styles.contentTitleFont}>일정</Text>
						</View>
						<Text>10월 가족 여행</Text>
						<Text>아부지 환갑</Text>
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
	},
	background: {
		flex: 1,
	},
	bottomSheetContainer: {
		height: 300,
		justifyContent: 'center',
		// alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 10,
		marginHorizontal: 15,
		marginBottom: 15,
		padding: 20,
	},
	previewHeader: {
		flexDirection: 'row',
		width: '100%',
		height: 60,
		borderColor: 'black',
		borderWidth: 1,
	},
	// 일정 날짜 텍스트
	previewDateFont: {
		fontSize: 50,
		fontWeight: 'bold',
		textAlignVertical: 'bottom',
	},
	// 날짜 단위 텍스트
	dateUnitFont: {
		fontSize: 30,
		fontWeight: 'bold',
		textAlignVertical: 'bottom',
	},
	contentTitleFont: {
		fontSize: 24,
	},
});
