import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/app_providers.dart';
import '../../widgets/personality_card.dart';

class PersonalitiesListScreen extends ConsumerWidget {
  const PersonalitiesListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final personalitiesAsync = ref.watch(personalitiesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('All Personalities'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => context.push('/create-personality'),
          ),
        ],
      ),
      body: personalitiesAsync.when(
        data: (personalities) {
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: personalities.length,
            itemBuilder: (context, index) {
              final personality = personalities[index];
              return PersonalityCard(
                personality: personality,
                onTap: () {
                  ref.read(selectedPersonalityIdProvider.notifier).state =
                      personality.personalityId;
                  context.push('/personalities/${personality.personalityId}');
                },
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: ${error.toString()}')),
      ),
    );
  }
}
