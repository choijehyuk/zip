## Expo를 사용하려면

- Node.js LTS - 짝수만 권장
- 소스 제어를 위한 Git
- ~~Watchman (Linux 또는 macOS 사용자용)~~

새 프로젝트 만들기

> npx create-expo-app —template
>

## React Navigation으로 화면 이동

### react navigation 패키지 설치

> npm install @react-navigation
>

> npx expo install react-native-screens react-native-safe-area-context
>

## eslint & prettier 설정

[ESLint와 Prettier 적용 및 셋팅](https://velog.io/@dvisign/블로그-형식-포트폴리오-개발기-2-초기-셋팅2)

eslint에도 code formatting rule이 있어, prettier와 충돌이 나기 때문에 추가적인 설정을 해주어야 한다.

같이 사용하기 위해서는 다음 두가지 module을 설치하고 설정해줘야 한다.

- eslint-plugin-prettier

    https://github.com/prettier/eslint-plugin-prettier

    - prettier를 ESLint 플러그인으로 추가한다. 즉, prettier에서 인식하는 코드상의 포맷 오류를 ESLint 오류로 출력해준다.
- eslint-config-prettier
    - eslint의 code-formatting rule을 모두 꺼서 conflict 방지

### 설치

<aside>
🔎 —save-dev : eslint 와 prettier 처럼 개발단에서만 필요한 경우 devDependencies 로 설정하기 위해

</aside>

> npm install —save-dev eslint-plugin-prettier
>

> npm install —save-dev —save-exact prettier
>

eslint-plugin-prettier는 prettier와 eslint를 설치하지 않기 때문에 따로 설치해주어야 한다.

`.eslintrc.json` 에서

```jsx
{
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

> npm install —save-dev eslint-config-prettier
>

`.eslintrc.json` 에서 extends에 추가

```jsx
{
  "extends": ["plugin:prettier/recommended"]
}
```

`plugin:prettier/recommended` 가 무슨 일을 하는가

```jsx
{
  // Prettier와 충돌하는 일부 ESLint 규칙을 끄는 구성을 활성화
	"extends": ["prettier"],
	// 플러그인 등록
  "plugins": ["prettier"],
  "rules": {
		// ESLint 내에서 Prettier를 실행하는 이 플러그인이 제공하는 규칙을 끔.
    "prettier/prettier": "error",
		// 이 플러그인에서 문제가 되는 두가지 ESLint 핵심 규칙을 끔
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off"
  }
}
```

Airbnb 코드스타일이 주로 사용되기 때문에 Airbnb 스타일 채택해서
아래 링크대로 적용시킬 예정
[ESLint와 Prettier 적용 및 셋팅](https://velog.io/@dvisign/블로그-형식-포트폴리오-개발기-2-초기-셋팅2)

## 안드로이드 스튜디오

### 안드로이드 스튜디오 설치

[Download Android Studio & App Tools - Android Developers](https://developer.android.com/studio)

### 안드로이드 스튜디오 환경변수 설정

내 PC > 속성 > 고급 시스템 설정

시스템 속성 > 고급 > 환경변수

시스템 변수에서 ANDROID_HOME을 설정해 줍니다.

변수 이름: ANDROID_HOME

변수 값: SDK 설치 위치

사용자 변수 > Path 수정에 들어가 %ANDROID_HOME%\platform-tools을 새로 만들어 줍니다.

### 설치 확인하기

cmd 켜고 adb —version

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/36503361-666c-45b5-9a85-4fe62cfed2cf/82fe445b-65c4-46b4-8421-0618e484f001/Untitled.png)

### Android Studio 도구 설정

1. Android Studio 앱을 열고 More Actions 클릭한 다음 SDK Manager를 선택
2. 설정 > 언어 및 프레임워크 > Android SDK로 이동. SDK 플랫폼 탭에서 최신 Android 버전(API 레벨)을 선택

    그런 다음 SDK Tools 탭을 클릭하고 Android SDK 빌드 도구 및 Android 에뮬레이터 버전이 하나 이상 설치되어 있는지 확인

3. 적용 및 확인을 클릭해 Android SDK 및 관련 빌드 도구 설치

### 가상 장치 설정

1. Android Studio 앱을 열고 More Actions 클릭한 다음 Virtual Device Manager(가상 장치 관리자)를 클릭
2. 장치 생성 클릭
3. 하드웨어 선택에서 에뮬레이션하려는 하드웨어 유형 선택
4. 에뮬레이터에 로드할 OS 버전을 선택하고 이미지를 다운로드
5. 원하는 다른 설정을 변경하고 마침을 눌러 가상 장치를 만듦.

    이제 AVD Manager 창에서 재생 버튼을 눌러 장치를 실행할 수 있다.