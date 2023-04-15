import {
  Button,
  Center,
  Heading,
  Input,
  KeyboardAvoidingView,
  Slider,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { Settings, Toy, getSettings, saveSettings } from "./storage";

export default function Admin(props: {
  barcodeData: string;
  onToyCreated: (toy: Toy) => void;
}) {
  const [settings, setSettings] = useState<Settings>();
  useEffect(() => {
    (async () => {
      setSettings(await getSettings());
    })();
  }, []);

  const [toy, setToy] = useState<Toy>({
    child_name: "",
    toy_name: "",
    toy_type: "",
    age: 5,
    qr_code: props.barcodeData,
  });
  return (
    <Center
      flex={1}
      px="3"
      // bg="#10b981"
    >
      <KeyboardAvoidingView
        h={{
          base: "400px",
          lg: "auto",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Center>
          <VStack flex="1" justifyContent="flex-start" w="100%" maxW="700">
            <Heading mb="3" minW={300}>
              Create a toy!
            </Heading>
            {/* <Text color="muted.400">
              Not to worry! Enter email address associated with your account and
              we’ll send a link to reset your password.
            </Text> */}
            <Text>Age:</Text>
            <Slider
              defaultValue={5}
              minValue={0}
              maxValue={20}
              step={1}
              colorScheme="orange"
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
            <Input
              placeholder="Child name"
              mt="10"
              mb="4"
              onChangeText={(t) => setToy({ ...toy, child_name: t })}
            />
            <Input
              placeholder="Toy name"
              mt="0"
              mb="4"
              onChangeText={(t) => setToy({ ...toy, toy_name: t })}
            />
            <Input
              placeholder="Type of toy"
              mt="0"
              mb="4"
              onChangeText={(t) => setToy({ ...toy, toy_type: t })}
            />
            <Button
              mb="4"
              onPress={async () => {
                await saveSettings({
                  toys: [...(settings?.toys || []), toy],
                });
                props.onToyCreated(toy);
              }}
            >
              Proceed
            </Button>
          </VStack>
        </Center>
      </KeyboardAvoidingView>
    </Center>
  );

  // return (
  //   <View style={styles.container}>
  //     <Stack space={4} w="75%" maxW="300px" mx="auto">
  //       <Input size="xs" placeholder="xs Input" />
  //       <Input size="sm" placeholder="sm Input" />
  //       <Input size="md" placeholder="md Input" />
  //       <Input size="lg" placeholder="lg Input" />
  //       <Input size="xl" placeholder="xl Input" />
  //       <Input size="2xl" placeholder="2xl Input" />
  //     </Stack>
  //   </View>
  // );
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
