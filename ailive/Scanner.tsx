import {
  BarCodeEvent,
  BarCodeScanner,
  BarCodeScannerResult,
} from "expo-barcode-scanner";
import { Camera, CameraType } from "expo-camera";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Settings, getSettings } from "./storage";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Scanner(props: { onBarCode: (data: string) => void }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const ref = useRef<Camera>();
  const timeout = useRef<any>();
  const [scan, setScan] = useState<BarCodeScannerResult>();

  const [settings, setSettings] = useState<Settings>();

  const existingToy = settings?.toys.find((t) => t.qr_code === scan?.data);

  useEffect(() => {
    (async () => {
      setSettings(await getSettings());
    })();
  });

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

  const _handleBarCodeScanned = (params: BarCodeEvent) => {
    // console.warn("test", params.data);
    // props.onBarCode(params.data);
    // console.warn(params);
    setScan(params);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setScan(undefined);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={_handleBarCodeScanned}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
      {scan && (
        <TouchableOpacity
          style={{
            position: "absolute",
            width: scan.bounds.size.width,
            height: scan.bounds.size.height,
          }}
          onPress={() => props.onBarCode(scan.data)}
        >
          <LottieView
            autoPlay
            // ref={animation}

            style={{
              position: "absolute",
              width: scan.bounds.size.width,
              height: scan.bounds.size.height,
              // backgroundColor: "#eee",
              top:
                (Math.round(
                  scan.bounds.origin.y + scan.bounds.size.height / 2
                ) /
                  windowHeight) *
                100,
              left:
                (Math.round(scan.bounds.origin.x + scan.bounds.size.width / 2) /
                  windowWidth) *
                10,
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={
              existingToy
                ? require("./assets/anims/dino.json")
                : require("./assets/anims/add.json")
            }
          />
        </TouchableOpacity>
      )}
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
