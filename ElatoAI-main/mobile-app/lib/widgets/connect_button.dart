import 'package:flutter/material.dart';
import 'dart:math' as math;

class ConnectButton extends StatefulWidget {
  final VoidCallback onPressed;
  final bool isConnected;

  const ConnectButton({
    Key? key,
    required this.onPressed,
    this.isConnected = false,
  }) : super(key: key);

  @override
  State<ConnectButton> createState() => _ConnectButtonState();
}

class _ConnectButtonState extends State<ConnectButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onPressed,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(100),
          color: const Color(0xFF292524), // stone-800
          boxShadow: const [
            BoxShadow(
              color: Color(0xFF292524),
              offset: Offset(0.5, 0.5),
            ),
            BoxShadow(
              color: Color(0xFF292524),
              offset: Offset(1, 1),
            ),
            BoxShadow(
              color: Color(0xFF292524),
              offset: Offset(1.5, 1.5),
            ),
            BoxShadow(
              color: Color(0xFF292524),
              offset: Offset(2, 2),
            ),
            BoxShadow(
              color: Color(0xFF292524),
              offset: Offset(2.5, 2.5),
            ),
            BoxShadow(
              color: Color(0xFF292524),
              offset: Offset(3, 3),
            ),
          ],
        ),
        child: Container(
          padding: const EdgeInsets.all(2),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(100),
            color: const Color(0xFFFACC15), // yellow-400
            border: Border.all(
              color: Colors.white.withOpacity(0.3),
              width: 2,
            ),
          ),
          child: AnimatedBuilder(
            animation: _controller,
            builder: (context, child) {
              return CustomPaint(
                painter: DottedPatternPainter(_controller.value),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.phone_outlined,
                        size: 16,
                        color: Color(0xFF292524),
                      ),
                      const SizedBox(width: 6),
                      Text(
                        widget.isConnected ? 'Disconnect' : 'Connect now',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF292524),
                          shadows: [
                            Shadow(
                              color: Colors.white,
                              offset: Offset(0, -1),
                              blurRadius: 0,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

// Custom painter for animated dotted pattern
class DottedPatternPainter extends CustomPainter {
  final double animation;

  DottedPatternPainter(this.animation);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.5)
      ..style = PaintingStyle.fill;

    const dotSize = 4.0;
    const dotSpacing = 8.0;
    final offset = animation * dotSpacing;

    for (double x = -offset; x < size.width + dotSize; x += dotSpacing) {
      for (double y = -offset; y < size.height + dotSize; y += dotSpacing) {
        canvas.drawCircle(
          Offset(x, y),
          dotSize / 2 * 0.8,
          paint,
        );
      }
    }
  }

  @override
  bool shouldRepaint(covariant DottedPatternPainter oldDelegate) {
    return oldDelegate.animation != animation;
  }
}
