import 'package:flutter/material.dart';
import 'dart:math' as math;

class ActiveCallSheet extends StatefulWidget {
  final VoidCallback onClose;

  const ActiveCallSheet({
    Key? key,
    required this.onClose,
  }) : super(key: key);

  @override
  State<ActiveCallSheet> createState() => _ActiveCallSheetState();
}

class _ActiveCallSheetState extends State<ActiveCallSheet>
    with SingleTickerProviderStateMixin {
  late AnimationController _auraController;
  CallState _state = CallState.connecting;

  @override
  void initState() {
    super.initState();
    _auraController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();

    // Simulate state changes
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _state = CallState.listening);
    });
  }

  @override
  void dispose() {
    _auraController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Container(
      height: size.height * 0.8,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFF1F2937), // gray-900
            Color(0xFF000000), // black
          ],
        ),
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Stack(
        children: [
          // Ambient background effect
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.center,
                  radius: 1.0,
                  colors: [
                    const Color(0xFF374151).withOpacity(0.5), // gray-800
                    const Color(0xFF1F2937).withOpacity(0.5), // gray-900
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // Content
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
              child: Column(
                children: [
                  // Status text
                  Text(
                    _getStatusText(),
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.7),
                      fontSize: 14,
                      letterSpacing: 2,
                      fontWeight: FontWeight.w300,
                    ),
                  ),

                  const Spacer(),

                  // Avatar with aura
                  AnimatedBuilder(
                    animation: _auraController,
                    builder: (context, child) {
                      return CustomPaint(
                        painter: AuraPainter(
                          animation: _auraController.value,
                          state: _state,
                        ),
                        child: Container(
                          width: 300,
                          height: 300,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Colors.white.withOpacity(0.1),
                              width: 4,
                            ),
                            image: const DecorationImage(
                              image: NetworkImage(
                                'https://via.placeholder.com/300',
                              ),
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 24),

                  // Character name
                  const Text(
                    'Pandit Ji',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.w300,
                      letterSpacing: 1,
                    ),
                  ),

                  const Spacer(),

                  // End call button
                  ElevatedButton.icon(
                    onPressed: widget.onClose,
                    icon: const Icon(Icons.phone, size: 20),
                    label: const Text('End Call'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFDC2626), // red-600
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 32,
                        vertical: 16,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(100),
                      ),
                      elevation: 8,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getStatusText() {
    switch (_state) {
      case CallState.connecting:
        return 'CONNECTING...';
      case CallState.listening:
        return 'LISTENING...';
      case CallState.speaking:
        return 'SPEAKING...';
    }
  }
}

enum CallState {
  connecting,
  listening,
  speaking,
}

class AuraPainter extends CustomPainter {
  final double animation;
  final CallState state;

  AuraPainter({
    required this.animation,
    required this.state,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final baseRadius = size.width / 2;

    // Determine aura color based on state
    Color auraColor;
    double maxRadius;
    double opacity;

    switch (state) {
      case CallState.connecting:
        auraColor = const Color(0xFFEAB308); // yellow
        maxRadius = baseRadius * (1 + 0.05 * (1 + math.sin(animation * 2 * math.pi)));
        opacity = 0.5;
        break;
      case CallState.listening:
        auraColor = const Color(0xFF06B6D4); // cyan
        maxRadius = baseRadius * (1 + 0.1 * (1 + math.sin(animation * 2 * math.pi)));
        opacity = 0.4 + 0.3 * (1 + math.sin(animation * 2 * math.pi)) / 2;
        break;
      case CallState.speaking:
        auraColor = const Color(0xFFEC4899); // pink
        maxRadius = baseRadius * (1 + 0.15 * (1 + math.sin(animation * 2 * math.pi)));
        opacity = 0.5 + 0.3 * (1 + math.sin(animation * 2 * math.pi)) / 2;
        break;
    }

    // Draw pulsing aura
    final paint = Paint()
      ..shader = RadialGradient(
        colors: [
          auraColor.withOpacity(opacity),
          auraColor.withOpacity(opacity * 0.5),
          Colors.transparent,
        ],
        stops: const [0.0, 0.5, 1.0],
      ).createShader(Rect.fromCircle(center: center, radius: maxRadius));

    canvas.drawCircle(center, maxRadius, paint);
  }

  @override
  bool shouldRepaint(covariant AuraPainter oldDelegate) {
    return oldDelegate.animation != animation || oldDelegate.state != state;
  }
}
