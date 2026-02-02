class AppConfig {
  static const String appName = 'SmartMurti';
  
  // These will be loaded from .env file
  static String get supabaseUrl => const String.fromEnvironment(
        'SUPABASE_URL',
        defaultValue: 'https://your-project.supabase.co',
      );
  
  static String get supabaseAnonKey => const String.fromEnvironment(
        'SUPABASE_ANON_KEY',
        defaultValue: 'your-anon-key-here',
      );
  
  static String get apiBaseUrl => const String.fromEnvironment(
        'API_BASE_URL',
        defaultValue: 'https://smartmurti.com',
      );
  
  static String get wsBaseUrl => const String.fromEnvironment(
        'WS_BASE_URL',
        defaultValue: 'wss://your-websocket-server.com',
      );
  
  // API Endpoints
  static const String sessionEndpoint = '/api/session';
  static const String userProfileEndpoint = '/api/user/profile';
  static const String personalitiesEndpoint = '/api/personalities';
  static const String voiceCloneEndpoint = '/api/voice/clone';
  static const String usageEndpoint = '/api/user/usage';
  
  // App Constants
  static const int maxAudioDuration = 600; // 10 minutes
  static const int freeLimit = 3600; // 1 hour in seconds
  static const int premiumLimit = 36000; // 10 hours in seconds
}
