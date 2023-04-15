import { BarCodeEvent, BarCodeScanner } from "expo-barcode-scanner";
import { Camera, CameraType } from "expo-camera";
import React, { useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const ref = useRef<Camera>();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function capture() {
    ref.current?.takePictureAsync();
    // setType((current) =>
    //   current === CameraType.back ? CameraType.front : CameraType.back
    // );
  }

  const _handleBarCodeScanned = (params: BarCodeEvent) => {};

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={_handleBarCodeScanned}
        style={{
          height: "50%",
          width: "50%",
        }}
      />
      {/* <Camera ref={ref} style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={capture}>
            <Text style={styles.text}>Capture my drawing!</Text>
          </TouchableOpacity>
        </View>
      </Camera> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
