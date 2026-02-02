import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../models/user.dart';

// Service Providers
final authServiceProvider = Provider<AuthService>((ref) => AuthService());
final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

// Auth State Provider
final authStateProvider = StreamProvider<AuthState>((ref) {
  final authService = ref.watch(authServiceProvider);
  return authService.authStateChanges;
});

// Current User Provider (Supabase Auth User)
final currentAuthUserProvider = Provider<User?>((ref) {
  final authService = ref.watch(authServiceProvider);
  return authService.currentUser;
});

// User Profile Provider (App User Model with full data)
final userProfileProvider = FutureProvider<AppUser?>((ref) async {
  final authState = ref.watch(authStateProvider);
  final apiService = ref.watch(apiServiceProvider);

  return authState.when(
    data: (state) async {
      if (state.session != null) {
        try {
          return await apiService.getUserProfile();
        } catch (e) {
          return null;
        }
      }
      return null;
    },
    loading: () => null,
    error: (_, __) => null,
  );
});

// Personalities Provider
final personalitiesProvider = FutureProvider<List<Personality>>((ref) async {
  final apiService = ref.watch(apiServiceProvider);
  return await apiService.getAllPersonalities();
});

// My Personalities Provider
final myPersonalitiesProvider = FutureProvider<List<Personality>>((ref) async {
  final authState = ref.watch(authStateProvider);
  final apiService = ref.watch(apiServiceProvider);

  return authState.when(
    data: (state) async {
      if (state.session != null) {
        try {
          return await apiService.getMyPersonalities();
        } catch (e) {
          return [];
        }
      }
      return [];
    },
    loading: () => [],
    error: (_, __) => [],
  );
});

// Selected Personality Provider (State)
final selectedPersonalityIdProvider = StateProvider<String?>((ref) => null);

// Selected Personality Details Provider
final selectedPersonalityProvider = Provider<Personality?>((ref) {
  final personalityId = ref.watch(selectedPersonalityIdProvider);
  final personalitiesAsync = ref.watch(personalitiesProvider);
  final myPersonalitiesAsync = ref.watch(myPersonalitiesProvider);

  if (personalityId == null) return null;

  return personalitiesAsync.whenOrNull(
    data: (personalities) {
      final found = personalities.where((p) => p.personalityId == personalityId).firstOrNull;
      if (found != null) return found;

      return myPersonalitiesAsync.whenOrNull(
        data: (myPersonalities) {
          return myPersonalities.where((p) => p.personalityId == personalityId).firstOrNull;
        },
      );
    },
  );
});

// Is Loading Provider
final isLoadingProvider = StateProvider<bool>((ref) => false);

// Error Message Provider
final errorMessageProvider = StateProvider<String?>((ref) => null);
