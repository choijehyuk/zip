import React, { useState, useEffect, useRef } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	FlatList,
	Image,
	TouchableOpacity,
	TextInput,
	Animated,
	Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../util/Interceptor';
import axiosFileInstance from '../util/FileInterceptor';
import * as ImagePicker from 'expo-image-picker';

export default function FamilyMainScreen({ route }) {
	const [family, setFamily] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [diaries, setDiaries] = useState([]);
	const [image, setImage] = useState([]);
	const [isEditMode, setIsEditMode] = useState(false); // 편집 모드 상태
	const [isFamilyNameEditMode, setIsFamilyNameEditMode] = useState(false); // 가족 이름 편집 모드 상태
	const [isFamilyContentEditMode, setIsFamilyContentEditMode] = useState(false); // 가족 이름 편집 모드 상태
	// const [BackgroudOrProfile, setBackgroudOrProfile] = useState(false);
	const [backgroundImageUri, setBackgroundImageUri] = useState(null);
	const [modifiedFamilyName, setModifiedFamilyName] = useState([]);
	const [modifiedFamilyContent, setModifiedFamilyContent] = useState([]);
	const [familyUpdated, setFamilyUpdated] = useState(false);
	const [memberProfileImgUrl, setMemberProfileImgUrl] = useState();

	// 이미지 변경 모달창 관련 변수
	const [modalVisible, setModalVisible] = useState(false);
	const translateY = useRef(new Animated.Value(300)).current;

	// 모달창 출력 함수
	const showButtons = () => {
		setModalVisible(true);
		Animated.timing(translateY, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	// 모달창 가리기 함수
	const hideButtons = () => {
		Animated.timing(translateY, {
			toValue: 300,
			duration: 300,
			useNativeDriver: true,
		}).start(() => {
			setModalVisible(false);
		});
	};

	// photo 입력받는 button을 눌렀을 때 실행되는 함수
	const _handlePhotoBtnPress = async (BackgroudOrProfile) => {
		console.log(BackgroudOrProfile);
		// 사용자의 갤러리 접근 권한 요청
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			alert('갤러리 접근 권한이 필요합니다.');
			return;
		}

		// 이미지 피커 런칭
		const pickerResult = await ImagePicker.launchImageLibraryAsync();
		if (pickerResult.cancelled === true) {
			return;
		}

		// 선택된 이미지의 URI
		const uri = pickerResult.uri;
		return _uploadImage(uri, BackgroudOrProfile);
	};

	const _uploadImage = async (uri, BackgroudOrProfile) => {
		const uriParts = uri.split('.');
		const fileType = uriParts[uriParts.length - 1];

		setImage({
			uri: uri,
			name: `photo.jpeg`,
			type: `image/jpeg`,
		});

		console.log('수정할 이미지 : ', image);
		if (BackgroudOrProfile == 'Backgrond') {
			setBackgroundImageUri(uri);
		} else {
			setMemberProfileImgUrl(uri);
		}
	};

	const modifyFamily = async () => {
		console.log('modifyFamily 함수 시작!');

		const formData = new FormData();

		const familyModifyRequest = {
			id: family.familyId,
			name: modifiedFamilyName,
			content: modifiedFamilyContent,
		};

		formData.append('familyModifyRequest', JSON.stringify(familyModifyRequest));

		formData.append('file', {
			uri: backgroundImageUri,
			name: `photo.jpeg`,
			type: `image/jpeg`,
		});

		await axiosFileInstance
			.post('/family/modify', formData)
			.then((response) => {
				console.log(response.data);
				console.log('수정된 가족의 ID : ', response.data.data.familyId);
				AsyncStorage.setItem(
					'familyId',
					JSON.stringify(response.data.data.familyId),
				);
				setFamilyUpdated(true); // 성공적으로 가족 정보가 수정되었다는 표시
			})
			.catch((error) => {
				console.error('가족 등록 에러: ', error);
			});
	};

	// onChangePhoto 함수 정의
	const onChangePhoto = (photoUri) => {
		// 가져온 사진의 URI를 이용하여 원하는 작업 수행
		console.log(`Selected photo URI: ${photoUri}`);
		// 예를 들어, state를 업데이트하거나 다른 작업을 수행할 수 있습니다.
	};

	// 편집 모드를 토글하는 함수
	const toggleEditMode = () => {
		setIsEditMode((prevMode) => !prevMode);
	};

	const handleEdit = () => {
		setIsEditMode(true);
	};

	const handleSave = () => {
		setFamily({ ...family, familyName: newFamilyName });
		setIsEditMode(false);
	};

	useEffect(() => {
		async function fetchData() {
			const familyId = await AsyncStorage.getItem('familyId');

			console.log('선택한 가족 ID : ', familyId);

			axiosInstance
				.get(`/family/choice?familyId=${familyId}`)
				.then((response) => {
					console.log('가족 정보 : ', response.data.data);
					setFamily(response.data.data);
					setModifiedFamilyName(response.data.data.familyName);
					setModifiedFamilyContent(response.data.data.familyContent);

					if (response.data.data.memberProfileImgUrl == null) {
						setMemberProfileImgUrl(
							'https://s3.ap-northeast-2.amazonaws.com/ziip.bucket/member/user.png',
						);
					} else {
						setMemberProfileImgUrl(response.data.data.memberProfileImgUrl);
					}

					if (response.data.data.familyProfileImgUrl == null) {
						setBackgroundImageUri(
							'https://s3.ap-northeast-2.amazonaws.com/ziip.bucket/diary/gray.png',
						);
					} else {
						setBackgroundImageUri(response.data.data.familyProfileImgUrl);
					}
				});

			axiosInstance
				.get(`/schedule/list?familyId=${familyId}`)
				.then((response) => {
					setSchedules(response.data.list);
					console.log('일정 : ', schedules);
				})
				.catch((error) => {
					console.error('There was an error!', error);
				});

			axiosInstance
				.get(`/diary/list?familyId=${familyId}`)
				.then((response) => {
					setDiaries(response.data.list);
					console.log('일기 : ', diaries);
				})
				.catch((error) => {
					console.error('There was an error!', error);
				});
		}

		fetchData();

		// 데이터 가져오기 작업이 끝난 후 familyUpdated를 다시 false로 설정
		if (familyUpdated) {
			setFamilyUpdated(false);
		}
	}, [familyUpdated]);

	return (
		<ImageBackground
			source={{ uri: backgroundImageUri }}
			style={styles.container}
			resizeMode="cover"
		>
			<View style={styles.header}>
				{isEditMode ? (
					<>
						<TouchableOpacity
							onPress={() => {
								// _handlePhotoBtnPress('Background');
								showButtons();
							}}
						>
							<Image source={require('../assets/camera.png')} style={{}} />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								modifyFamily();
								setIsEditMode(false);
								setIsFamilyNameEditMode(false);
								setIsFamilyContentEditMode(false);
							}}
						>
							<Text style={{ color: 'white', fontSize: 20 }}>완료</Text>
						</TouchableOpacity>
					</>
				) : (
					<TouchableOpacity
						onPress={() => {
							setIsEditMode(true);
						}}
					>
						<Image
							source={require('../assets/geer.png')}
							style={styles.editButton}
						/>
					</TouchableOpacity>
				)}
			</View>

			<View
				style={[
					{ flexDirection: 'row', alignItems: 'center' },
					isEditMode
						? {
								borderBottomWidth: 1,
								borderBottomColor: 'white',
								marginHorizontal: 60,
						  }
						: { borderBottomWidth: 0 },
				]}
			>
				{isEditMode && isFamilyNameEditMode ? (
					<TextInput
						style={familyStyles.familyName}
						defaultValue={family.familyName}
						editable={isFamilyNameEditMode} // 편집 모드가 활성화되면 편집 가능하게 설정
						onChangeText={(text) => {
							setModifiedFamilyName(text);
						}}
						autoFocus={isFamilyNameEditMode} // 편집 모드가 활성화되면 자동으로 포커스를 설정하여 키보드를 나타나게 함
					/>
				) : (
					<Text style={familyStyles.familyName}>{family.familyName}</Text>
				)}

				{isEditMode && (
					<TouchableOpacity
						style={[
							familyStyles.editButtonFamilyText,
							{ position: 'absolute', right: 0, paddingTop: 5 },
						]}
						onPress={() => setIsFamilyNameEditMode(true)}
					>
						<Image
							source={require('../assets/pencil.png')}
							style={styles.editButtonIcon}
						/>
					</TouchableOpacity>
				)}
			</View>

			<View
				style={[
					{ flexDirection: 'row', alignItems: 'center', marginTop: 5 },
					isEditMode
						? {
								borderBottomWidth: 1,
								borderBottomColor: 'white',
								marginHorizontal: 60,
						  }
						: { borderBottomWidth: 0 },
				]}
			>
				{isEditMode && isFamilyContentEditMode ? (
					<TextInput
						style={familyStyles.familyContent}
						defaultValue={family.familyContent}
						editable={isFamilyContentEditMode} // 편집 모드가 활성화되면 편집 가능하게 설정
						onChangeText={(text) => {
							setModifiedFamilyContent(text);
						}}
						autoFocus={isFamilyContentEditMode} // 편집 모드가 활성화되면 자동으로 포커스를 설정하여 키보드를 나타나게 함
					/>
				) : (
					<Text style={familyStyles.familyContent}>{family.familyContent}</Text>
				)}

				{isEditMode && (
					<TouchableOpacity
						style={[
							familyStyles.editButtonFamilyText,
							{ position: 'absolute', right: 0 },
						]}
						onPress={() => setIsFamilyContentEditMode(true)}
					>
						<Image
							source={require('../assets/pencil.png')}
							style={styles.editButtonIcon}
						/>
					</TouchableOpacity>
				)}
			</View>

			<Image source={{ uri: memberProfileImgUrl }} style={styles.memberImage} />
			{isEditMode && (
				<TouchableOpacity
					onPress={() => {
						_handlePhotoBtnPress('Profile');
					}}
					style={memberStyles.button}
				>
					<Image source={require('../assets/camera.png')} style={{}} />
				</TouchableOpacity>
			)}

			<Text style={styles.headingSchedule}>일정</Text>
			<FlatList
				data={schedules}
				renderItem={({ item }) => (
					<View style={styles.scheduleItem}>
						<Image
							source={require('../assets/user.png')}
							style={styles.userImage}
						/>
						<Text style={styles.whiteText}>{item.memberId}</Text>
						<Text style={styles.whiteText}>{item.name}</Text>
					</View>
				)}
				keyExtractor={(item) => item.scheduleId.toString()}
			/>
			{/* 일기 리스트 출력 */}
			<Text style={styles.headingDiary}>일기</Text>
			<FlatList
				data={diaries}
				renderItem={({ item }) => (
					<View style={styles.diaryItem}>
						<Image
							source={require('../assets/user.png')}
							style={styles.userImage}
						/>
						<Text style={styles.whiteText}>{item.nickname}</Text>
						<Text style={styles.whiteText}>{item.title}</Text>
					</View>
				)}
				keyExtractor={(item) => item.diaryId.toString()}
			/>

			{modalVisible && (
				<Modal
					transparent={true}
					animationType="none"
					visible={modalVisible}
					onRequestClose={hideButtons}
				>
					<Animated.View
						style={[styles.modalContainer, { transform: [{ translateY }] }]}
					>
						<TouchableOpacity
							style={{ marginTop: 30 }}
							onPress={() => _handlePhotoBtnPress('Background')}
						>
							<Text>앨범에서 사진 선택하기</Text>
						</TouchableOpacity>
						<View style={{ borderBottomColor: 'black'}}>
						</View>
						<TouchableOpacity
							style={{}}
							onPress={() => _handlePhotoBtnPress('Background')}
						>
							<Text>기본 이미지로 변경하기</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={hideButtons}>
							<Text>취소</Text>
						</TouchableOpacity>
					</Animated.View>
				</Modal>
			)}
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'gray',
	},
	header: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between', // 이 부분 변경
		paddingHorizontal: 20,
		paddingTop: 30,
	},
	editButton: {
		width: 30,
		height: 30,
	},
	memberImage: {
		width: 80, // 원하는 이미지 크기로 조정
		height: 80, // 원하는 이미지 크기로 조정
		marginTop: 20,
		borderRadius: 50, // 원형 이미지를 위해
	},
	headingSchedule: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		marginTop: 30,
		marginBottom: 10,
	},
	headingDiary: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 10,
	},
	scheduleItem: {
		flexDirection: 'row',
		borderRadius: 10,
		padding: 7,
		marginVertical: 5,
		width: '90',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
	userImage: {
		width: 20,
		height: 20,
		marginRight: 30, // 간격을 15로 조절했습니다.
		borderRadius: 20,
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
		marginRight: 30, // 간격을 15로 조절했습니다.
	},
	diaryItem: {
		flexDirection: 'row',
		borderRadius: 10,
		padding: 7,
		marginVertical: 5,
		width: '90',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
	modalContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 300,
		backgroundColor: 'white',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 20,
	},
});

const familyStyles = StyleSheet.create({
	familyName: {
		flex: 1, // flex를 사용하여 텍스트가 늘어나도 버튼이 끝에 고정되도록 합니다.
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		color: 'white',
		marginTop: 20,
	},

	editButtonFamilyText: {
		width: 20,
		height: 20,
		// marginRight: 30,
	},

	familyContent: {
		flex: 1, // flex를 사용하여 텍스트가 늘어나도 버튼이 끝에 고정되도록 합니다.
		fontSize: 16,
		color: 'white',
		marginTop: 20,
		textAlign: 'center',
	},
});

const memberStyles = StyleSheet.create({
	memberContainer: {
		position: 'relative',
		width: 100, // 원하는 이미지 크기로 조정하세요.
		height: 100, // 원하는 이미지 크기로 조정하세요.
	},
	memberImage: {
		width: '100%',
		height: '100%',
		borderRadius: 50, // 원하는 border radius 값을 조정하세요.
	},
	button: {
		position: 'absolute',
		bottom: 430,
		left: 220,
		width: 40,
		height: 40, // 원하는 버튼 크기로 조정하세요.
	},
});
