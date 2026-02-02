import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/app_providers.dart';
import '../../widgets/common/gradient_button.dart';

class CreatePersonalityScreen extends ConsumerStatefulWidget {
  const CreatePersonalityScreen({super.key});

  @override
  ConsumerState<CreatePersonalityScreen> createState() =>
      _CreatePersonalityScreenState();
}

class _CreatePersonalityScreenState
    extends ConsumerState<CreatePersonalityScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _characterPromptController = TextEditingController();
  final _voicePromptController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _characterPromptController.dispose();
    _voicePromptController.dispose();
    super.dispose();
  }

  Future<void> _handleCreate() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final apiService = ref.read(apiServiceProvider);
      await apiService.createPersonality({
        'title': _titleController.text.trim(),
        'short_description': _descriptionController.text.trim(),
        'character_prompt': _characterPromptController.text.trim(),
        'voice_prompt': _voicePromptController.text.trim(),
        'key': _titleController.text.toLowerCase().replaceAll(' ', '_'),
        'oai_voice': 'alloy', // Default voice
        'provider': 'openai',
        'subtitle': '',
      });

      ref.invalidate(myPersonalitiesProvider);

      if (mounted) {
        context.pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Personality created successfully!')),
        );
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Personality'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Create your custom AI personality',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 32),

              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Personality Name',
                  hintText: 'e.g., Wise Teacher',
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
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Short Description',
                  hintText: 'Brief description of the personality',
                ),
                maxLines: 2,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a description';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _characterPromptController,
                decoration: const InputDecoration(
                  labelText: 'Character Description',
                  hintText: 'Describe the personality in detail',
                ),
                maxLines: 5,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter character description';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _voicePromptController,
                decoration: const InputDecoration(
                  labelText: 'Voice Style',
                  hintText: 'Describe how they should speak',
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please describe voice style';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 32),

              GradientButton(
                onPressed: _isLoading ? null : _handleCreate,
                isLoading: _isLoading,
                child: const Text('Create Personality'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
