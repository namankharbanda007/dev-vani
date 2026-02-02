import 'package:dio/dio.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/app_config.dart';
import '../models/user.dart';

class ApiService {
  late final Dio _dio;
  final SupabaseClient _supabase = Supabase.instance.client;

  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
        },
      ),
    );

    // Add interceptor for authentication
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final session = _supabase.auth.currentSession;
          if (session != null) {
            options.headers['Authorization'] = 'Bearer ${session.accessToken}';
          }
          return handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            // Token expired, try to refresh
            try {
              await _supabase.auth.refreshSession();
              // Retry the request
              final opts = error.requestOptions;
              final session = _supabase.auth.currentSession;
              if (session != null) {
                opts.headers['Authorization'] = 'Bearer ${session.accessToken}';
              }
              final response = await _dio.fetch(opts);
              return handler.resolve(response);
            } catch (e) {
              return handler.next(error);
            }
          }
          return handler.next(error);
        },
      ),
    );
  }

  // Get session token for AI providers
  Future<Map<String, dynamic>> getSession() async {
    try {
      final response = await _dio.get(AppConfig.sessionEndpoint);
      return response.data as Map<String, dynamic>;
    } catch (e) {
      throw Exception('Failed to get session: $e');
    }
  }

  // Get user profile
  Future<User> getUserProfile() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) throw Exception('Not authenticated');

      // Query Supabase directly for user profile
      final response = await _supabase
          .from('users')
          .select('*, personality:personality_id(*)')
          .eq('user_id', userId)
          .single();

      return User.fromJson(response);
    } catch (e) {
      throw Exception('Failed to get user profile: $e');
    }
  }

  // Update user profile
  Future<User> updateUserProfile(Map<String, dynamic> updates) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) throw Exception('Not authenticated');

      final response = await _supabase
          .from('users')
          .update(updates)
          .eq('user_id', userId)
          .select('*, personality:personality_id(*)')
          .single();

      return User.fromJson(response);
    } catch (e) {
      throw Exception('Failed to update user profile: $e');
    }
  }

  // Get all personalities (premade)
  Future<List<Personality>> getAllPersonalities() async {
    try {
      final response = await _supabase
          .from('personalities')
          .select()
          .is_('creator_id', null)
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => Personality.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw Exception('Failed to get personalities: $e');
    }
  }

  // Get user's custom personalities
  Future<List<Personality>> getMyPersonalities() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) return [];

      final response = await _supabase
          .from('personalities')
          .select()
          .eq('creator_id', userId);

      return (response as List)
          .map((json) => Personality.fromJson(json as Map<String, dynamic>))
          .toList();
    } catch (e) {
      throw Exception('Failed to get my personalities: $e');
    }
  }

  // Create new personality
  Future<Personality> createPersonality(Map<String, dynamic> personalityData) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) throw Exception('Not authenticated');

      final response = await _supabase
          .from('personalities')
          .insert({
        ...personalityData,
        'creator_id': userId,
      })
          .select()
          .single();

      return Personality.fromJson(response);
    } catch (e) {
      throw Exception('Failed to create personality: $e');
    }
  }

  // Get usage stats
  Future<Map<String, dynamic>> getUserUsage() async {
    try {
      final response = await _dio.get('/api/user/usage');
      return response.data as Map<String, dynamic>;
    } catch (e) {
      throw Exception('Failed to get usage stats: $e');
    }
  }

  // Voice cloning
  Future<String> cloneVoice(String audioFilePath) async {
    try {
      final formData = FormData.fromMap({
        'audio': await MultipartFile.fromFile(audioFilePath),
      });

      final response = await _dio.post(
        AppConfig.voiceCloneEndpoint,
        data: formData,
      );

      return response.data['voice_id'] as String;
    } catch (e) {
      throw Exception('Failed to clone voice: $e');
    }
  }
}
