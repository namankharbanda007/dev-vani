import 'package:flutter/material.dart';
import '../models/user.dart';

class PersonalityHorizontalList extends StatelessWidget {
  final List<Personality> allPersonalities;
  final List<Personality> myPersonalities;
  final Function(Personality) onPersonalitySelected;

  const PersonalityHorizontalList({
    Key? key,
    required this.allPersonalities,
    required this.myPersonalities,
    required this.onPersonalitySelected,
  }) : super(key: key);

  // Categories matching web app
  static const Map<String, Map<String, dynamic>> categories = {
    'spiritual': {
      'title': '🙏 Spiritual',
      'characters': [
        'pandit ji',
        'the spiritual guide',
        'ganpati havan by pandit ji',
        'the astrologer',
      ],
    },
    'seniors': {
      'title': '👴 Seniors',
      'characters': [
        'old age friend',
        'old days friend',
        'the tech translator',
      ],
    },
    'adult': {
      'title': '👨 Adults',
      'characters': [
        'the advocate',
        'the travel guide',
        'sports commentator',
        'the chef\'s assistant',
        'the gift guru',
        'the interviewer',
        'the fitness coach',
      ],
    },
    'students': {
      'title': '🎓 Students',
      'characters': [
        'the exam coach',
        'the language exchange',
        'the debate partner',
        'the career counselor',
      ],
    },
    'children': {
      'title': '👶 Children',
      'characters': [
        'the phonics parrot',
        'the dino-historians',
        'bedtime stories by grandma',
        'the time traveler from 3025',
        'buddy',
      ],
    },
  };

  Map<String, List<Personality>> _categorizePersonalities() {
    final Map<String, List<Personality>> categorized = {};

    for (final personality in allPersonalities.where((p) => p.creatorId == null)) {
      final titleLower = personality.title.toLowerCase();
      bool found = false;

      for (final category in categories.entries) {
        final chars = category.value['characters'] as List<String>;
        for (final char in chars) {
          if (titleLower.contains(char.toLowerCase()) ||
              char.toLowerCase().contains(titleLower)) {
            categorized.putIfAbsent(category.key, () => []);
            categorized[category.key]!.add(personality);
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }

    return categorized;
  }

  @override
  Widget build(BuildContext context) {
    final categorized = _categorizePersonalities();
    final categoryOrder = ['spiritual', 'seniors', 'adult', 'students', 'children'];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // My Characters section
          if (myPersonalities.isNotEmpty) ...[
            _buildCategorySection(
              'My Characters',
              myPersonalities,
            ),
            const SizedBox(height: 32),
          ],

          // Categorized personalities
          ...categoryOrder.map((categoryKey) {
            final personalities = categorized[categoryKey];
            if (personalities == null || personalities.isEmpty) {
              return const SizedBox.shrink();
            }

            final categoryData = categories[categoryKey]!;
            return Column(
              children: [
                _buildCategorySection(
                  categoryData['title'] as String,
                  personalities,
                ),
                const SizedBox(height: 32),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildCategorySection(String title, List<Personality> personalities) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Color(0xFF1F2937),
            fontFamily: 'Lora',
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 240,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: personalities.length,
            itemBuilder: (context, index) {
              final personality = personalities[index];
              return _PersonalityCard(
                personality: personality,
                onTap: () => onPersonalitySelected(personality),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _PersonalityCard extends StatelessWidget {
  final Personality personality;
  final VoidCallback onTap;

  const _PersonalityCard({
    required this.personality,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 160,
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: Colors.white,
          border: Border.all(
            color: const Color(0xFFE5E7EB),
            width: 1,
          ),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 4,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Image area (3:4 aspect ratio)
              Expanded(
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Image or gradient placeholder
                    personality.subtitle.startsWith('http')
                        ? Image.network(
                            personality.subtitle,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => _buildPlaceholder(),
                          )
                        : _buildPlaceholder(),

                    // Gradient overlay
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withOpacity(0.7),
                          ],
                        ),
                      ),
                    ),

                    // Title at bottom
                    Positioned(
                      left: 12,
                      right: 12,
                      bottom: 12,
                      child: Text(
                        personality.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(0xFFDDD6FE), // purple-200
            Color(0xFFFEF3C7), // amber-100
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: const Center(
        child: Icon(
          Icons.person,
          size: 48,
          color: Colors.white70,
        ),
      ),
    );
  }
}
