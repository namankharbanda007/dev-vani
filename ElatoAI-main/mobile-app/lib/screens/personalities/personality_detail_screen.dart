import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/app_providers.dart';
import '../../widgets/common/gradient_button.dart';

class PersonalityDetailScreen extends ConsumerWidget {
  final String personalityId;

  const PersonalityDetailScreen({
    Key? key,
    required this.personalityId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final personalitiesAsync = ref.watch(personalitiesProvider);
    final myPersonalitiesAsync = ref.watch(myPersonalitiesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Personality Details'),
      ),
      body: personalitiesAsync.when(
        data: (personalities) {
          final personality = personalities
              .where((p) => p.personalityId == personalityId)
              .firstOrNull;

          if (personality == null) {
            return myPersonalitiesAsync.when(
              data: (myPersonalities) {
                final myPersonality = myPersonalities
                    .where((p) => p.personalityId == personalityId)
                    .firstOrNull;
                    
                if (myPersonality == null) {
                  return const Center(child: Text('Personality not found'));
                }
                
                return _buildPersonalityDetail(context, ref, myPersonality);
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (_, __) => const Center(child: Text('Personality not found')),
            );
          }

          return _buildPersonalityDetail(context, ref, personality);
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (_, __) => const Center(child: Text('Error loading personality')),
      ),
    );
  }

  Widget _buildPersonalityDetail(
    BuildContext context,
    WidgetRef ref,
    dynamic personality,
  ) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Avatar/Image
          Center(
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF9333EA), Color(0xFFD97706)],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: personality.subtitle.toString().startsWith('http')
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: Image.network(
                        personality.subtitle.toString(),
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Icon(
                          Icons.face,
                          color: Colors.white,
                          size: 60,
                        ),
                      ),
                    )
                  : const Icon(Icons.face, color: Colors.white, size: 60),
            ),
          ),
          const SizedBox(height: 24),

          // Title
          Text(
            personality.title.toString(),
            style: Theme.of(context).textTheme.displaySmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),

          // Short Description
          Text(
            personality.shortDescription.toString(),
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.grey[600],
                ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),

          // Character Description
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'About',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    personality.characterPrompt.toString(),
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),

          // Action Buttons
          GradientButton(
            onPressed: () async {
              final apiService = ref.read(apiServiceProvider);
              await apiService.updateUserProfile({
                'personality_id': personalityId,
              });
              
              ref.invalidate(userProfileProvider);
              
              if (context.mounted) {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Personality selected!')),
                );
              }
            },
            child: const Text('Select This Personality'),
          ),
        ],
      ),
    );
  }
}
