### React Native with Expo

- 앱 생성하기
> npx create-expo-app zip-app(프로젝트명)

- 웹에서 실행하려면 종속성 설치 필요
> npx expo install react-dom react-native-web @expo/webpack-config

- 앱 실행하기
> npx expo start

앱스토어, 구글 플레이스토어에서 Expo Go 설치 후
터미널에 출력되는 QR코드를 활용하면 본인의 핸드폰과 연동됨!

이때 PC와 핸드폰이 같은 WiFi에 연결되어 있어야 함

Expo 공식문서 튜토리얼 (핸드폰 갤러리 접근해 사진 업로드 및 아이콘 넣고 이미지 저장)
``` javascript
// App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// 앱 내에서 스크린샷을 찍을 수 있도록
import { captureRef } from 'react-native-view-shot';

import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const PlaceholderImage = require('./assets/background-image.png')

export default function App() {
  const imageRef = useRef();

  const [status, requestPermission] = MediaLibrary.usePermissions();

  const [pickedEmoji, setPickedEmoji] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAppOptions, setShowAppOptions] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  }

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  }

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert('Saved!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (status === null) {
    requestPermission();
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage}/>
            {pickedEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> : null }
          </View>
        </View>
        {showAppOptions ? (
          <View />
        ) : (
          <View style={styles.footerContainer}>
            <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
            <Button label="Use this photo" onPress={() => setShowAppOptions(true)}/>
          </View>
        )}
        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
            </View>
          </View>
        ) : (
          <View />
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
        <StatusBar style="light" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});


```