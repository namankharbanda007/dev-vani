import { useRef, useState } from "react";
import { Alert, Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { DbUser } from "../../models/types";
import { rechargeWallet } from "../../lib/smartMurtiApi";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";

interface WalletTabScreenProps {
  dbUser: DbUser | null;
  onBalanceChange: () => Promise<void>;
}

const rechargeOptions = [99, 199, 499, 999];

export function WalletTabScreen({ dbUser, onBalanceChange }: WalletTabScreenProps) {
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Card press animations
  const cardAnims = useRef(rechargeOptions.map(() => new Animated.Value(1))).current;

  const animateIn = (index: number) => {
    Animated.spring(cardAnims[index], { toValue: 0.95, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };

  const handleCustomRecharge = () => {
    const amount = Number(customAmount);
    if (!amount || amount < 10) {
      setError("Enter a valid custom amount of at least Rs. 10.");
      return;
    }

    void handleRecharge(amount);
  };
  const animateOut = (index: number) => {
    Animated.spring(cardAnims[index], { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();
  };

  const handleRecharge = (amount: number) => {
    Alert.alert(
      "Confirm Recharge",
      `Add Rs. ${amount} credits to your wallet?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: `Add Rs. ${amount}`,
          onPress: async () => {
            try {
              setLoadingAmount(amount);
              setMessage(null);
              setError(null);

              const result = await rechargeWallet(amount);
              await onBalanceChange();
              setMessage(
                `Recharge complete. Your new balance is Rs. ${Number(result.newBalance ?? 0).toLocaleString("en-IN")}.`
              );
            } catch (nextError) {
              setError(nextError instanceof Error ? nextError.message : "Recharge failed.");
            } finally {
              setLoadingAmount(null);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.balanceHero}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceValue}>
          Rs. {Number(dbUser?.wallet_balance ?? 0).toLocaleString("en-IN")}
        </Text>
        <Text style={styles.balanceBody}>
          Use wallet credits for premium spiritual guidance, reports, and upcoming services.
        </Text>
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Wallet credits</Text>
        <Text style={styles.noticeText}>
          Recharge your Smart Murti wallet here for premium guidance, reports, and upcoming devotional services.
        </Text>
      </View>

      {message ? (
        <View style={styles.successCard}>
          <Text style={styles.successText}>{message}</Text>
        </View>
      ) : null}

      {error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recharge wallet</Text>
        <Text style={styles.sectionSubtitle}>Choose an amount to add</Text>
      </View>

      <View style={styles.customCard}>
        <Text style={styles.customTitle}>Custom amount</Text>
        <Text style={styles.customText}>Add the exact number of wallet credits you want.</Text>

        <View style={styles.customInputRow}>
          <View style={styles.currencyPill}>
            <Text style={styles.currencyText}>Rs.</Text>
          </View>
          <TextInput
            value={customAmount}
            onChangeText={setCustomAmount}
            keyboardType="number-pad"
            placeholder="Enter amount"
            placeholderTextColor={colors.gray400}
            style={styles.customInput}
          />
        </View>

        <Pressable
          onPress={handleCustomRecharge}
          disabled={loadingAmount !== null}
          style={({ pressed }) => [
            styles.customButton,
            pressed && { opacity: 0.88 },
            loadingAmount !== null && styles.customButtonDisabled,
          ]}
        >
          <Text style={styles.customButtonText}>Add Custom Amount</Text>
        </Pressable>
      </View>

      <View style={styles.rechargeGrid}>
        {rechargeOptions.map((amount, index) => (
          <Animated.View key={amount} style={[styles.rechargeCardWrap, { transform: [{ scale: cardAnims[index] }] }]}>
            <Pressable
              onPress={() => handleRecharge(amount)}
              onPressIn={() => animateIn(index)}
              onPressOut={() => animateOut(index)}
              disabled={loadingAmount !== null}
              android_ripple={{ color: "rgba(124, 58, 237, 0.1)" }}
              style={[
                styles.rechargeCard,
                loadingAmount === amount && styles.rechargeCardActive,
              ]}
            >
              <Text style={styles.rechargeAmount}>Rs. {amount}</Text>
              <Text style={styles.rechargeAction}>
                {loadingAmount === amount ? "Processing..." : "Add Credits"}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 18,
    paddingBottom: 28,
  },
  balanceHero: {
    borderRadius: 28,
    backgroundColor: colors.gray900,
    padding: 20,
    gap: 8,
  },
  balanceLabel: {
    color: "#FDE68A",
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  balanceValue: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 40,
  },
  balanceBody: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  noticeCard: {
    borderRadius: 22,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 16,
    gap: 6,
  },
  noticeTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  noticeText: {
    color: colors.gray700,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },
  successCard: {
    borderRadius: 20,
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.successBorder,
    padding: 16,
  },
  successText: {
    color: colors.successText,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 20,
  },
  errorCard: {
    borderRadius: 20,
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: 16,
  },
  errorText: {
    color: colors.errorText,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 20,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 24,
  },
  sectionSubtitle: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  customCard: {
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 18,
    gap: 12,
  },
  customTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 17,
  },
  customText: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },
  customInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  currencyPill: {
    width: 56,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  currencyText: {
    color: colors.purple900,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  customInput: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: colors.gray50,
    paddingHorizontal: 16,
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  customButton: {
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.purple900,
    alignItems: "center",
    justifyContent: "center",
  },
  customButtonDisabled: {
    opacity: 0.6,
  },
  customButtonText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  rechargeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  rechargeCardWrap: {
    width: "47%",
  },
  rechargeCard: {
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 18,
    gap: 8,
  },
  rechargeCardActive: {
    backgroundColor: "#F3E8FF",
    borderWidth: 1,
    borderColor: "#D8B4FE",
  },
  rechargeAmount: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 28,
  },
  rechargeAction: {
    color: colors.purple900,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
});
