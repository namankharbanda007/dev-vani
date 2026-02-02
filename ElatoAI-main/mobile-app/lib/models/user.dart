class User {
  final String userId;
  final String email;
  final String supervisorName;
  final String superviseeName;
  final String superviseePersona;
  final int superviseeAge;
  final String? avatarUrl;
  final String personalityId;
  final Personality? personality;
  final String languageCode;
  final int sessionTime;
  final String? lastSessionReset;
  final bool isPremium;
  final String? deviceId;

  const User({
    required this.userId,
    required this.email,
    required this.supervisorName,
    required this.superviseeName,
    required this.superviseePersona,
    required this.superviseeAge,
    this.avatarUrl,
    required this.personalityId,
    this.personality,
    required this.languageCode,
    required this.sessionTime,
    this.lastSessionReset,
    this.isPremium = false,
    this.deviceId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userId: json['user_id'] as String,
      email: json['email'] as String,
      supervisorName: json['supervisor_name'] as String? ?? '',
      superviseeName: json['supervisee_name'] as String? ?? '',
      superviseePersona: json['supervisee_persona'] as String? ?? '',
      superviseeAge: json['supervisee_age'] as int? ?? 14,
      avatarUrl: json['avatar_url'] as String?,
      personalityId: json['personality_id'] as String,
      personality: json['personality'] != null
          ? Personality.fromJson(json['personality'] as Map<String, dynamic>)
          : null,
      languageCode: json['language_code'] as String? ?? 'en-US',
      sessionTime: json['session_time'] as int? ?? 0,
      lastSessionReset: json['last_session_reset'] as String?,
      isPremium: json['is_premium'] as bool? ?? false,
      deviceId: json['device_id'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user_id': userId,
      'email': email,
      'supervisor_name': supervisorName,
      'supervisee_name': superviseeName,
      'supervisee_persona': superviseePersona,
      'supervisee_age': superviseeAge,
      'avatar_url': avatarUrl,
      'personality_id': personalityId,
      'language_code': languageCode,
      'session_time': sessionTime,
      'last_session_reset': lastSessionReset,
      'is_premium': isPremium,
      'device_id': deviceId,
    };
  }

  User copyWith({
    String? userId,
    String? email,
    String? supervisorName,
    String? superviseeName,
    String? superviseePersona,
    int? superviseeAge,
    String? avatarUrl,
    String? personalityId,
    Personality? personality,
    String? languageCode,
    int? sessionTime,
    String? lastSessionReset,
    bool? isPremium,
    String? deviceId,
  }) {
    return User(
      userId: userId ?? this.userId,
      email: email ?? this.email,
      supervisorName: supervisorName ?? this.supervisorName,
      superviseeName: superviseeName ?? this.superviseeName,
      superviseePersona: superviseePersona ?? this.superviseePersona,
      superviseeAge: superviseeAge ?? this.superviseeAge,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      personalityId: personalityId ?? this.personalityId,
      personality: personality ?? this.personality,
      languageCode: languageCode ?? this.languageCode,
      sessionTime: sessionTime ?? this.sessionTime,
      lastSessionReset: lastSessionReset ?? this.lastSessionReset,
      isPremium: isPremium ?? this.isPremium,
      deviceId: deviceId ?? this.deviceId,
    );
  }
}

// Import for Personality model
class Personality {
  final String personalityId;
  final String key;
  final String title;
  final String subtitle;
  final String shortDescription;
  final String characterPrompt;
  final String voicePrompt;
  final String oaiVoice;
  final String provider;
  final String? creatorId;
  final double pitchFactor;
  final String firstMessagePrompt;
  final bool isStory;
  final bool isDoctor;
  final bool isChildVoice;

  const Personality({
    required this.personalityId,
    required this.key,
    required this.title,
    required this.subtitle,
    required this.shortDescription,
    required this.characterPrompt,
    required this.voicePrompt,
    required this.oaiVoice,
    required this.provider,
    this.creatorId,
    this.pitchFactor = 1.0,
    this.firstMessagePrompt = '',
    this.isStory = false,
    this.isDoctor = false,
    this.isChildVoice = false,
  });

  factory Personality.fromJson(Map<String, dynamic> json) {
    return Personality(
      personalityId: json['personality_id'] as String,
      key: json['key'] as String,
      title: json['title'] as String,
      subtitle: json['subtitle'] as String? ?? '',
      shortDescription: json['short_description'] as String? ?? '',
      characterPrompt: json['character_prompt'] as String? ?? '',
      voicePrompt: json['voice_prompt'] as String? ?? '',
      oaiVoice: json['oai_voice'] as String,
      provider: json['provider'] as String,
      creatorId: json['creator_id'] as String?,
      pitchFactor: (json['pitch_factor'] as num?)?.toDouble() ?? 1.0,
      firstMessagePrompt: json['first_message_prompt'] as String? ?? '',
      isStory: json['is_story'] as bool? ?? false,
      isDoctor: json['is_doctor'] as bool? ?? false,
      isChildVoice: json['is_child_voice'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'personality_id': personalityId,
      'key': key,
      'title': title,
      'subtitle': subtitle,
      'short_description': shortDescription,
      'character_prompt': characterPrompt,
      'voice_prompt': voicePrompt,
      'oai_voice': oaiVoice,
      'provider': provider,
      'creator_id': creatorId,
      'pitch_factor': pitchFactor,
      'first_message_prompt': firstMessagePrompt,
      'is_story': isStory,
      'is_doctor': isDoctor,
      'is_child_voice': isChildVoice,
    };
  }
}
