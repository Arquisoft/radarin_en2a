## The mobileapp

```
npx react-native init mobileapp
```

Run on Android, needs an Android emulator or a device connected.
For the emulator, download the [Android SDK](https://developer.android.com/studio#downloads) (command-line tools, no white-spaces in path, "C:\AndroidSDK\cmdline-tools\latest").
Follow
https://www.decoide.org/react-native/docs/android-setup.html
https://dev.to/enriquem/android-sdk-without-studio-3idg

```
.\sdkmanager.bat "system-images;android-29;default;x86_64" "platforms;android-29" "build-tools;29.0.3" "extras;google;m2repository" "extras;android;m2repository"
```
```
.\avdmanager.bat create avd --name test-avd --package "system-images;android-29;default;x86_64"
```
```
.\emulator.exe -avd test-avd
```
https://developer.android.com/studio/run/emulator-acceleration#vm-windows
my case
```
.\sdkmanager.bat "extras;intel;Hardware_Accelerated_Execution_Manager"
```
and run the installer in `\extras\intel\Hardware_Accelerated_Execution_Manager`

```
.\emulator.exe -avd test-avd
```
https://stackoverflow.com/a/61163091 (Java 14)

```
npx react-native run-android
#or
npm run android
```