import 'package:flutter/material.dart';

import '../utils/constants.dart';

/// Zeigt eine zentrierte Platzhalter-Nachricht an
class PlaceholderMessage extends StatelessWidget {
  const PlaceholderMessage(this.message, {super.key});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        padding: const EdgeInsets.all(AppConstants.spacingXL),
        decoration: BoxDecoration(
          color: AppConstants.overlayLight.withAlpha(
            AppConstants.overlayAlphaLight,
          ),
          borderRadius: BorderRadius.circular(AppConstants.radiusS),
        ),
        child: Text(
          message,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyLarge,
        ),
      ),
    );
  }
}
