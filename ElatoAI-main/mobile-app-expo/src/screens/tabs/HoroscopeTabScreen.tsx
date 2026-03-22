import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DbUser, HoroscopePayload } from "../../models/types";
import { fetchHoroscope, getRemoteAsset, getUserMetadata } from "../../lib/smartMurtiApi";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/typography";

const signs = [
  { name: "Aries", index: "01", symbol: "AR" },
  { name: "Taurus", index: "02", symbol: "TA" },
  { name: "Gemini", index: "03", symbol: "GE" },
  { name: "Cancer", index: "04", symbol: "CA" },
  { name: "Leo", index: "05", symbol: "LE" },
  { name: "Virgo", index: "06", symbol: "VI" },
  { name: "Libra", index: "07", symbol: "LI" },
  { name: "Scorpio", index: "08", symbol: "SC" },
  { name: "Sagittarius", index: "09", symbol: "SG" },
  { name: "Capricorn", index: "10", symbol: "CP" },
  { name: "Aquarius", index: "11", symbol: "AQ" },
  { name: "Pisces", index: "12", symbol: "PI" },
] as const;

const dateOptions = ["Yesterday", "Today", "Tomorrow"] as const;
type HoroscopeDate = (typeof dateOptions)[number];
const horoscopeCache = new Map<string, HoroscopePayload>();

interface HoroscopeTabScreenProps {
  userName: string;
  dbUser: DbUser | null;
}



function getSunSignName(dateString?: string) {
  if (!dateString) return "Aries";
  const date = new Date(dateString);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

export function HoroscopeTabScreen({ userName, dbUser }: HoroscopeTabScreenProps) {
  const metadata = useMemo(() => getUserMetadata(dbUser), [dbUser]);
  const defaultSign = useMemo(() => getSunSignName(metadata.birth_date), [metadata.birth_date]);
  const [sign, setSign] = useState<string>(defaultSign);
  const [date, setDate] = useState<HoroscopeDate>("Today");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<HoroscopePayload | null>(null);

  const activeSign = useMemo(() => signs.find((item) => item.name === sign) || signs[0], [sign]);
  const cacheKey = useMemo(() => `${sign}:${date}`, [date, sign]);

  useEffect(() => {
    setSign(defaultSign);
  }, [defaultSign]);

  const loadHoroscope = useCallback(
    async (forceRefresh = false) => {
      const cachedPayload = horoscopeCache.get(cacheKey);
      if (cachedPayload && !forceRefresh) {
        setPayload(cachedPayload);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        if (forceRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);
        const nextPayload = await fetchHoroscope(sign, date);
        horoscopeCache.set(cacheKey, nextPayload);
        setPayload(nextPayload);
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Failed to fetch horoscope.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [cacheKey, date, sign]
  );

  useEffect(() => {
    void loadHoroscope();
  }, [loadHoroscope]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void loadHoroscope(true)}
          colors={[colors.purple900]}
        />
      }
    >
      <View style={styles.heroCard}>
        <View style={styles.heroTextWrap}>
          <Text style={styles.heroEyebrow}>Daily Horoscope</Text>
          <Text style={styles.heroTitle}>Your stars for {userName.split(" ")[0] || "today"}</Text>
          <Text style={styles.heroText}>
            Check your mood, lucky signals, and practical guidance for the day.
          </Text>
        </View>
        <View style={styles.heroZodiacWrap}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{activeSign.symbol}</Text>
          </View>
          <Image source={{ uri: getRemoteAsset(`/assets/horoscope-${activeSign.index}.webp`) }} style={styles.heroImage} />
        </View>
      </View>

      <View style={styles.selectorGroup}>
        <Text style={styles.selectorLabel}>Choose your sign</Text>
        <View style={styles.signGrid}>
          {signs.map((item) => (
            <Pressable
              key={item.name}
              onPress={() => setSign(item.name)}
              style={[styles.signPill, sign === item.name && styles.signPillActive]}
            >
              <Image source={{ uri: getRemoteAsset(`/assets/horoscope-${item.index}.webp`) }} style={styles.signThumb} />
              <Text style={[styles.signText, sign === item.name && styles.signTextActive]}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.selectorGroup}>
        <Text style={styles.selectorLabel}>Day</Text>
        <View style={styles.dateRow}>
          {dateOptions.map((item) => (
            <Pressable
              key={item}
              onPress={() => setDate(item)}
              style={[styles.dateButton, date === item && styles.dateButtonActive]}
            >
              <Text style={[styles.dateButtonText, date === item && styles.dateButtonTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Reading your chart...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : payload ? (
        <>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.resultSign}>{payload.sign}</Text>
                <Text style={styles.resultDate}>{payload.date}</Text>
              </View>
              <View style={styles.moodBadge}>
                <Ionicons name="sparkles" size={14} color={colors.white} />
                <Text style={styles.moodText}>{payload.mood}</Text>
              </View>
            </View>

            <Text style={styles.mainReading}>{payload.content}</Text>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Lucky Number</Text>
                <Text style={styles.metricValue}>{payload.lucky_number}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Lucky Color</Text>
                <Text style={styles.metricValue}>{payload.lucky_color}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Lucky Time</Text>
                <Text style={styles.metricValue}>{payload.lucky_time}</Text>
              </View>
            </View>
          </View>

          <View style={styles.aspectColumn}>
            {[
              payload.love ? { title: "Love", data: payload.love } : null,
              payload.career ? { title: "Career", data: payload.career } : null,
              payload.money ? { title: "Money", data: payload.money } : null,
              payload.health ? { title: "Health", data: payload.health } : null,
              payload.travel ? { title: "Travel", data: payload.travel } : null,
            ]
              .filter(Boolean)
              .map((item) => (
                <View key={item!.title} style={styles.aspectCard}>
                  <View style={styles.aspectHeader}>
                    <Text style={styles.aspectTitle}>{item!.title}</Text>
                    <Text style={styles.aspectScore}>{item!.data.percentage}%</Text>
                  </View>
                  <Text style={styles.aspectBody}>{item!.data.text}</Text>
                </View>
              ))}
          </View>
        </>
      ) : null}
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
  heroCard: {
    borderRadius: 28,
    backgroundColor: colors.gray900,
    padding: 20,
    gap: 14,
  },
  heroTextWrap: {
    gap: 8,
  },
  heroZodiacWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 180,
  },
  heroImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  heroBadge: {
    position: "absolute",
    right: 18,
    top: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FCD34D",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  heroBadgeText: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  heroEyebrow: {
    color: "#FCD34D",
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 38,
  },
  heroText: {
    color: "rgba(255,255,255,0.78)",
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  selectorGroup: {
    gap: 10,
  },
  selectorLabel: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  signGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  signPill: {
    width: "31%",
    flexShrink: 0,
    borderRadius: 18,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    alignItems: "center",
    gap: 6,
  },
  signPillActive: {
    borderColor: "#FCD34D",
    backgroundColor: "#FFF8E1",
  },
  signThumb: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  signText: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
  },
  signTextActive: {
    color: colors.gray900,
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateButton: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  dateButtonActive: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FCD34D",
  },
  dateButtonText: {
    color: colors.gray700,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  dateButtonTextActive: {
    color: colors.gray900,
  },
  loadingCard: {
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 22,
    alignItems: "center",
  },
  loadingText: {
    color: colors.gray500,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  errorCard: {
    borderRadius: 22,
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: 18,
  },
  errorText: {
    color: colors.errorText,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  resultCard: {
    borderRadius: 28,
    backgroundColor: colors.white,
    padding: 20,
    gap: 16,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  resultSign: {
    color: colors.gray900,
    fontFamily: fonts.heading,
    fontSize: 28,
  },
  resultDate: {
    color: colors.gray500,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  moodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: colors.purple900,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  moodText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  mainReading: {
    color: colors.gray700,
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: "30%",
    borderRadius: 18,
    backgroundColor: colors.gray50,
    padding: 14,
    gap: 4,
  },
  metricLabel: {
    color: colors.gray500,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    textTransform: "uppercase",
  },
  metricValue: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  aspectColumn: {
    gap: 12,
  },
  aspectCard: {
    borderRadius: 22,
    backgroundColor: colors.white,
    padding: 18,
    gap: 8,
  },
  aspectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aspectTitle: {
    color: colors.gray900,
    fontFamily: fonts.bodyBold,
    fontSize: 16,
  },
  aspectScore: {
    color: colors.purple900,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  aspectBody: {
    color: colors.gray700,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
});
