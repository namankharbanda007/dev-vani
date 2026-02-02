import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/app_providers.dart';
import '../../widgets/personality_horizontal_list.dart';
import '../../widgets/connect_button.dart';
import '../../widgets/active_call_sheet.dart';
import '../../widgets/chat_sheet.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  void _showCallSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ActiveCallSheet(
        onClose: () => Navigator.pop(context),
      ),
    );
  }

  void _showChatSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ChatSheet(
        onClose: () => Navigator.pop(context),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final userAsync = ref.watch(userProfileProvider);
    final personalitiesAsync = ref.watch(personalitiesProvider);
    final myPersonalitiesAsync = ref.watch(myPersonalitiesProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6FA),
      body: SafeArea(
        child: Column(
          children: [
            // Header with welcome and buttons
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Welcome text
                  userAsync.when(
                    data: (user) {
                      final name = user?.supervisorName?.isNotEmpty == true 
                          ? user!.supervisorName! 
                          : 'Friend';
                      return RichText(
                        text: TextSpan(
                          text: 'Welcome Back, ',
                          style: const TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1F2937),
                            fontFamily: 'Lora',
                          ),
                          children: [
                            TextSpan(
                              text: name,
                              style: TextStyle(
                                foreground: Paint()
                                  ..shader = const LinearGradient(
                                    colors: [
                                      Color(0xFF9333EA), // purple-600
                                      Color(0xFFD97706), // amber-600
                                    ],
                                  ).createShader(const Rect.fromLTWH(0, 0, 200, 70)),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                    loading: () => const SizedBox(height: 40),
                    error: (_, __) => const SizedBox(height: 40),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Continue your spiritual journey or start a new conversation.',
                    style: TextStyle(
                      fontSize: 16,
                      color: Color(0xFF6B7280),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Buttons row
                  Row(
                    children: [
                      // Chat button
                      InkWell(
                        onTap: _showChatSheet,
                        borderRadius: BorderRadius.circular(100),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.5),
                            shape: BoxShape.circle,
                            boxShadow: const [
                              BoxShadow(
                                color: Colors.black26,
                                blurRadius: 8,
                                offset: Offset(0, 2),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.message_outlined,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),

                      // Connect now button
                      ConnectButton(
                        onPressed: _showCallSheet,
                        isConnected: false,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Personality grid
            Expanded(
              child: personalitiesAsync.when(
                data: (personalities) {
                  return myPersonalitiesAsync.when(
                    data: (myPersonalities) {
                      return PersonalityHorizontalList(
                        allPersonalities: personalities,
                        myPersonalities: myPersonalities,
                        onPersonalitySelected: (personality) async {
                          try {
                            final apiService = ref.read(apiServiceProvider);
                            await apiService.updateUserProfile({
                              'personality_id': personality.personalityId,
                            });
                            ref.invalidate(userProfileProvider);
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Failed to select personality: $e')),
                              );
                            }
                          }
                        },
                      );
                    },
                    loading: () => const Center(child: CircularProgressIndicator()),
                    error: (error, _) => Center(
                      child: Text('Failed to load personalities: $error'),
                    ),
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, _) => Center(
                  child: Text('Failed to load personalities: $error'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
