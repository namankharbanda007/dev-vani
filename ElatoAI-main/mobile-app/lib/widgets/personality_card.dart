import 'package:flutter/material.dart';
import '../models/user.dart';

class PersonalityCard extends StatelessWidget {
  final Personality personality;
  final VoidCallback onTap;
  final bool isSelected;

  const PersonalityCard({
    Key? key,
    required this.personality,
    required this.onTap,
    this.isSelected = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: isSelected
            ? const BorderSide(color: Color(0xFF9333EA), width: 2)
            : BorderSide.none,
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Avatar/Icon
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF9333EA), Color(0xFFD97706)],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: personality.subtitle.startsWith('http')
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(
                          personality.subtitle,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const Icon(
                            Icons.face,
                            color: Colors.white,
                            size: 28,
                          ),
                        ),
                      )
                    : const Icon(Icons.face, color: Colors.white, size: 28),
              ),
              const SizedBox(width: 16),
              
              // Title and Description
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      personality.title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    if (personality.shortDescription.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        personality.shortDescription,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Colors.grey[600],
                            ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ],
                ),
              ),
              
              // Chevron or checkmark
              Icon(
                isSelected ? Icons.check_circle : Icons.chevron_right,
                color: isSelected ? const Color(0xFF9333EA) : Colors.grey,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
