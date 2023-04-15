import * as Speech from "expo-speech";
import { NativeBaseProvider } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Admin from "./Admin";
import RecordScreen from "./RecordScreen";
import Scanner from "./Scanner";
import { Settings, getSettings } from "./storage";

export default function App() {
  const [barcodeData, setBarcodeData] = useState<string>();
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    console.warn("get settings");
    (async () => {
      setSettings(await getSettings());
    })();
  }, [barcodeData]);

  const existingToy = settings?.toys.find((t) => t.qr_code === barcodeData);
  useEffect(() => {
    (async () => {
      const voices = await Speech.getAvailableVoicesAsync();
      setVoices(voices.filter((v) => v.language === "en-US"));
    })();
  }, []);

  const speak = () => {
    const thingToSay = "Hello! I'm a dinosaur";

    // get random voice
    const randomVoice = voices[Math.floor(Math.random() * voices.length)];

    Speech.speak(thingToSay, {
      voice: randomVoice.identifier,
    });
  };

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        {/* <Admin /> */}
        {/* <Button onPress={() => speak()} title="Set barcode" /> */}
        {barcodeData && !existingToy && (
          <Admin
            onToyCreated={() => {
              setBarcodeData(undefined);
            }}
            barcodeData={barcodeData}
          />
        )}
        {barcodeData && existingToy && <RecordScreen />}
        {/* {barcodeData && <RecordScreen />} */}
        {!barcodeData && <Scanner onBarCode={setBarcodeData} />}

        {/* <Camera ref={ref} style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={capture}>
            <Text style={styles.text}>Capture my drawing!</Text>
          </TouchableOpacity>
        </View>
      </Camera> */}
      </View>
    </NativeBaseProvider>
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
