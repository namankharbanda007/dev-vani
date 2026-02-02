class Conversation {
  final String conversationId;
  final String role; // 'user' or 'assistant'
  final String content;
  final String userId;
  final bool isSensitive;
  final String personalityKey;
  final DateTime createdAt;

  const Conversation({
    required this.conversationId,
    required this.role,
    required this.content,
    required this.userId,
    required this.isSensitive,
    required this.personalityKey,
    required this.createdAt,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      conversationId: json['conversation_id'] as String,
      role: json['role'] as String,
      content: json['content'] as String,
      userId: json['user_id'] as String,
      isSensitive: json['is_sensitive'] as bool? ?? false,
      personalityKey: json['personality_key'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'conversation_id': conversationId,
      'role': role,
      'content': content,
      'user_id': userId,
      'is_sensitive': isSensitive,
      'personality_key': personalityKey,
      'created_at': createdAt.toIso8601String(),
    };
  }

  bool get isUser => role == 'user';
  bool get isAssistant => role == 'assistant';
}
