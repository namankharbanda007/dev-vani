import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/app_providers.dart';
import '../../widgets/common/glassmorphic_card.dart';
import '../../widgets/personality_card.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  @override
  Widget build(BuildContext context) {
    final userAsync = ref.watch(userProfileProvider);
    final personalitiesAsync = ref.watch(personalitiesProvider);
    final myPersonalitiesAsync = ref.watch(myPersonalitiesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SmartMurti'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => context.push('/profile'),
          ),
        ],
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(userProfileProvider);
            ref.invalidate(personalitiesProvider);
            ref.invalidate(myPersonalitiesProvider);
          },
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Welcome Header
                userAsync.when(
                  data: (user) {
                    if (user == null) {
                      return const SizedBox.shrink();
                    }
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome Back,',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                color: Colors.grey[600],
                              ),
                        ),
                        ShaderMask(
                          shaderCallback: (bounds) => const LinearGradient(
                            colors: [Color(0xFF9333EA), Color(0xFFD97706)],
                          ).createShader(bounds),
                          child: Text(
                            user.supervisorName.isEmpty
                                ? 'Friend'
                                : user.supervisorName,
                            style: Theme.of(context).textTheme.displayMedium?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                        ),
                        const SizedBox(height:8),
                        Text(
                          'Continue your spiritual journey',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                color: Colors.grey[600],
                              ),
                        ),
                      ],
                    );
                  },
                  loading: () => const SizedBox(
                    height: 100,
                    child: Center(child: CircularProgressIndicator()),
                  ),
                  error: (_, __) => const SizedBox.shrink(),
                ),
                const SizedBox(height: 32),

                // Active Personality Card
                userAsync.when(
                  data: (user) {
                    if (user?.personality == null) return const SizedBox.shrink();
                    
                    return GlassmorphicCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Active Personality',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Container(
                                width: 60,
                                height: 60,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFF9333EA), Color(0xFFD97706)],
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(Icons.face, color: Colors.white, size: 32),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      user!.personality!.title,
                                      style: Theme.of(context).textTheme.titleLarge,
                                    ),
                                    Text(
                                      user.personality!.shortDescription,
                                      style: Theme.of(context).textTheme.bodySmall,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: () {
                                // TODO: Connect to voice
                              },
                              icon: const Icon(Icons.mic),
                              label: const Text('Connect Now'),
                              style: ElevatedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                  loading: () => const SizedBox(
                    height: 150,
                    child: Center(child: CircularProgressIndicator()),
                  ),
                  error: (_, __) => const SizedBox.shrink(),
                ),
                const SizedBox(height: 32),

                // Usage Stats
                userAsync.when(
                  data: (user) {
                    if (user == null) return const SizedBox.shrink();
                    
                    final sessionMinutes = (user.sessionTime / 60).floor();
                    final limitMinutes = (user.isPremium ? 600 : 60);
                    final percentageUsed = (sessionMinutes / limitMinutes * 100).clamp(0, 100).toInt();

                    return GlassmorphicCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Usage This Month',
                                style: Theme.of(context).textTheme.titleMedium,
                              ),
                              Text(
                                user.isPremium ? 'Premium' : 'Free',
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: user.isPremium
                                          ? const Color(0xFFD97706)
                                          : Colors.grey,
                                    ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          LinearProgressIndicator(
                            value: percentageUsed / 100,
                            backgroundColor: Colors.grey[300],
                            minHeight: 8,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '$sessionMinutes / $limitMinutes minutes',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    );
                  },
                  loading: () => const SizedBox.shrink(),
                  error: (_, __) => const SizedBox.shrink(),
                ),
                const SizedBox(height: 32),

                // My Custom Personalities
                myPersonalitiesAsync.when(
                  data: (myPersonalities) {
                    if (myPersonalities.isEmpty) return const SizedBox.shrink();
                    
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'My Personalities',
                              style: Theme.of(context).textTheme.headlineMedium,
                            ),
                            TextButton.icon(
                              onPressed: () => context.push('/create-personality'),
                              icon: const Icon(Icons.add),
                              label: const Text('Create'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        ...myPersonalities.take(3).map(
                          (personality) => PersonalityCard(
                            personality: personality,
                            onTap: () {
                              ref.read(selectedPersonalityIdProvider.notifier).state =
                                  personality.personalityId;
                              context.push('/personalities/${personality.personalityId}');
                            },
                          ),
                        ),
                      ],
                    );
                  },
                  loading: () => const SizedBox.shrink(),
                  error: (_, __) => const SizedBox.shrink(),
                ),
                const SizedBox(height: 16),

                // All Personalities
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Explore Personalities',
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    TextButton(
                      onPressed: () => context.push('/personalities'),
                      child: const Text('View All'),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                personalitiesAsync.when(
                  data: (personalities) {
                    return Column(
                      children: personalities.take(5).map(
                        (personality) => PersonalityCard(
                          personality: personality,
                          onTap: () async {
                            ref.read(selectedPersonalityIdProvider.notifier).state =
                                personality.personalityId;
                            
                            // Update user's personality
                            final apiService = ref.read(apiServiceProvider);
                            await apiService.updateUserProfile({
                              'personality_id': personality.personalityId,
                            });
                            
                            ref.invalidate(userProfileProvider);
                          },
                        ),
                      ).toList(),
                    );
                  },
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: CircularProgressIndicator(),
                    ),
                  ),
                  error: (error, stack) => Center(
                    child: Text('Error: ${error.toString()}'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // TODO: Quick connect to voice
        },
        icon: const Icon(Icons.mic),
        label: const Text('Talk'),
        backgroundColor: const Color(0xFF9333EA),
      ),
    );
  }
}
