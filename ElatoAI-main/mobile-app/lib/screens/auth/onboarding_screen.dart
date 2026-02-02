import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/app_providers.dart';
import '../../widgets/common/gradient_button.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _superviseeNameController = TextEditingController();
  final _superviseeAgeController = TextEditingController();
  final _superviseePersonaController = TextEditingController();
  String? _selectedPersonalityId;
  bool _isLoading = false;

  @override
  void dispose() {
    _superviseeNameController.dispose();
    _superviseeAgeController.dispose();
    _superviseePersonaController.dispose();
    super.dispose();
  }

  Future<void> _handleComplete() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedPersonalityId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a personality')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final apiService = ref.read(apiServiceProvider);
      await apiService.updateUserProfile({
        'supervisee_name': _superviseeNameController.text.trim(),
        'supervisee_age': int.parse(_superviseeAgeController.text),
        'supervisee_persona': _superviseePersonaController.text.trim(),
        'personality_id': _selectedPersonalityId,
      });

      if (mounted) {
        context.go('/');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final personalitiesAsync = ref.watch(personalitiesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Complete Your Profile'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Tell us about who will be using SmartMurti',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: 32),

                TextFormField(
                  controller: _superviseeNameController,
                  decoration: const InputDecoration(
                    labelText: 'Name',
                    hintText: 'Enter name',
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                TextFormField(
                  controller: _superviseeAgeController,
                  decoration: const InputDecoration(
                    labelText: 'Age',
                    hintText: 'Enter age',
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter age';
                    }
                    final age = int.tryParse(value);
                    if (age == null || age < 1 || age > 120) {
                      return 'Please enter a valid age';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                TextFormField(
                  controller: _superviseePersonaController,
                  decoration: const InputDecoration(
                    labelText: 'Interests/Personality',
                    hintText: 'Tell us about their interests',
                  ),
                  maxLines: 3,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please describe their interests';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                Text(
                  'Choose a starting personality',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 16),

                personalitiesAsync.when(
                  data: (personalities) {
                    return Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: personalities.take(6).map((p) {
                        final isSelected = _selectedPersonalityId == p.personalityId;
                        return ChoiceChip(
                          label: Text(p.title),
                          selected: isSelected,
                          onSelected: (selected) {
                            setState(() {
                              _selectedPersonalityId =
                                  selected ? p.personalityId : null;
                            });
                          },
                        );
                      }).toList(),
                    );
                  },
                  loading: () => const Center(child: CircularProgressIndicator()),
                  error: (_, __) => const Text('Failed to load personalities'),
                ),
                const SizedBox(height: 32),

                GradientButton(
                  onPressed: _isLoading ? null : _handleComplete,
                  isLoading: _isLoading,
                  child: const Text('Get Started'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
