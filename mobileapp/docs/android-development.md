# Installing the Android development environment

Install [Android Studio](https://developer.android.com/studio#downloads). Then, from the SDK manager install the following packages (you may need to choose a emulator accelerator other than `Intel x86 Emulator Accelerator (HAXM installer)`, see [Configure hardware acceleration](https://developer.android.com/studio/run/emulator-acceleration#vm-windows)):

![SDK Platform](img/sdk-platform.png)
![SDK Tools](img/sdk-tools.png)

Then, create an environment variable named `ANDROID_HOME` with the Android SDK root path:

![ANDROID_HOME](img/android-home.png)

Finally, create an [Android Virtual Device](https://developer.android.com/studio/run/managing-avds).
