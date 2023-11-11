import {
	StyleSheet,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import axiosInstance from '../../../util/Interceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';

export default function PlanCreate(props) {
	const [isCreating, setIsCreating] = useState(false);
	// 계획 등록에 필요한 데이터
	const { scheduleId } = props; // 일정 id
	const [planTitle, setPlanTitle] = useState(''); // 계획 제목

	// 담당자 선택
	const [members, setMembers] = useState([]);
	console.log(members);
	const [memberNames, setMemberNames] = useState([]);
	const [memberId, setMemberId] = useState(0);

	const getMemberIdByNickname = (nickname) => {
		members.map((item) => {
			if (item.nickname === nickname) {
				setMemberId(item.memberId);
				return;
			}
		});
	};

	const createMemberList = (memberArray) => {
		const emptyList = [];

		memberArray.map((item) => {
			emptyList.push(item.nickname);
		});

		console.log('멤버 이름 리스트: ', emptyList);
		setMemberNames(emptyList);
	};

	const getMemberData = async () => {
		const familyId = await AsyncStorage.getItem('familyId');
		axiosInstance
			.get(`/family/member`, {
				params: {
					familyId: familyId,
				},
			})
			.then((res) => {
				const memberArray = res.data.data.familyMemberDetailResponseDtoList;
				setMembers(memberArray);
				createMemberList(memberArray);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getMemberData();
	}, []);

	// 할일 등록
	const createPlan = () => {
		const PlanWriteRequestDto = {
			scheduleId: scheduleId, // 할일을 등록할 일정 id
			title: planTitle, // 할 일 내용
			memberId: memberId, // 선택한 담당자 id
		};
		console.log(PlanWriteRequestDto);

		if (!planTitle) {
			Alert.alert('', '내용을 입력해 주세요', [
				{
					text: '확인',
					onPress: () => setIsCreating(true),
				},
			]);

			return;
		}

		if (memberId === 0) {
			Alert.alert('', '담당자가 선택되지 않았습니다.', [
				{
					text: '확인',
					onPress: () => setIsCreating(true),
				},
			]);
			return;
		}

		getMemberIdByNickname;

		axiosInstance
			.post(`/plan/write`, PlanWriteRequestDto)
			.then((res) => {
				console.log(res.data.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<View style={styles.planCreateContainer}>
			{isCreating ? (
				<>
					<View style={styles.planCheckbox}>
						<Ionicons name="checkbox-outline" size={24} color="black" />
					</View>
					<View style={styles.planTitle}>
						<TextInput
							style={styles.planTitleInput}
							placeholder="할 일 등록하기"
							onChangeText={(text) => {
								setPlanTitle(text);
							}}
						/>
					</View>
					<View style={styles.planManager}>
						<SelectDropdown
							data={memberNames}
							onSelect={(selectedMember) => {
								getMemberIdByNickname(selectedMember);
							}}
							defaultButtonText="담당자"
							buttonStyle={{
								width: 100,
								height: 24,
								backgroundColor: 'white',
								borderColor: 'grey',
								borderWidth: 1,
							}}
							buttonTextStyle={{
								fontSize: 10,
							}}
							rowTextStyle={{
								fontSize: 12,
							}}
						/>
					</View>
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							onPress={() => {
								setIsCreating(false);
							}}
						>
							<Text>취소</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={async () => {
								await createPlan();
								setIsCreating(false);
							}}
						>
							<Text>등록</Text>
						</TouchableOpacity>
					</View>
				</>
			) : (
				<TouchableOpacity
					style={styles.addPlanContainer}
					onPress={() => setIsCreating(true)}
				>
					<AntDesign name="plus" size={20} color="black" />
					<Text>할 일 추가하기</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	planCreateContainer: {
		flexDirection: 'row',
		gap: 5,
		opacity: 0.5,
	},
	planCheckbox: {
		width: '10%',
	},
	planTitle: {
		width: '35%',
	},
	planTitleInput: {
		borderBottomWidth: 1,
		borderColor: 'gray',
	},
	planManager: {
		width: '20%',
	},
	addPlanContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 5,
	},
	buttonContainer: {
		marginLeft: 50,
		gap: 10,
		width: '20%',
	},
});