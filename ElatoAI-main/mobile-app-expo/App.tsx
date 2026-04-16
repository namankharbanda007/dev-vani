import "react-native-url-polyfill/auto";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus, View } from "react-native";
import { useFonts as useKarlaFonts, Karla_400Regular, Karla_700Bold } from "@expo-google-fonts/karla";
import { useFonts as useLoraFonts, Lora_700Bold } from "@expo-google-fonts/lora";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Session } from "@supabase/supabase-js";
import { AuthScreen } from "./src/screens/AuthScreen";
import { ConfigErrorScreen } from "./src/screens/ConfigErrorScreen";
import { LoadingScreen } from "./src/screens/LoadingScreen";
import { NativeShellScreen } from "./src/screens/NativeShellScreen";
import { supabase, supabaseConfigError } from "./src/lib/supabase";
import { colors } from "./src/theme/colors";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [karlaLoaded] = useKarlaFonts({
    Karla_400Regular,
    Karla_700Bold,
  });
  const [loraLoaded] = useLoraFonts({
    Lora_700Bold,
  });

  useEffect(() => {
    if (supabaseConfigError || !supabase) {
      setAuthReady(true);
      return;
    }

    const client = supabase;
    let isMounted = true;

    const bootstrapAuth = async () => {
      const { data, error } = await client.auth.getSession();

      if (error) {
        console.warn("Failed to restore session", error.message);
      }

      if (isMounted) {
        setSession(data.session ?? null);
        setAuthReady(true);
      }
    };

    bootstrapAuth();

    const authSubscription = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setAuthReady(true);
    });

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          client.auth.startAutoRefresh();
        } else {
          client.auth.stopAutoRefresh();
        }
      }
    );

    return () => {
      isMounted = false;
      authSubscription.data.subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  const fontsLoaded = karlaLoaded && loraLoaded;

  if (!fontsLoaded || !authReady) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: colors.softPaper }}>
          <StatusBar style="dark" />
          <LoadingScreen />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.softPaper }}>
        <StatusBar style="dark" />
        {supabaseConfigError ? (
          <ConfigErrorScreen message={supabaseConfigError} />
        ) : session ? (
          <NativeShellScreen session={session} />
        ) : (
          <AuthScreen />
        )}
      </View>
    </SafeAreaProvider>
  );
}
