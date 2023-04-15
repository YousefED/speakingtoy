import AsyncStorage from "@react-native-async-storage/async-storage";

export type Toy = {
  child_age: number;
  child_name: string;
  toy_name: string;
  toy_type: string;
  qr_code: string;
};

export type Settings = {
  toys: Toy[];
};

export async function getSettings() {
  const settingsStr = await AsyncStorage.getItem("settingsq12");
  if (!settingsStr) {
    return {
      toys: [],
    };
  }
  return JSON.parse(settingsStr) as Settings;
}

export function saveSettings(settings: Settings) {
  return AsyncStorage.setItem("settingsq12", JSON.stringify(settings));
}
