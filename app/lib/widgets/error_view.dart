import 'package:flutter/material.dart';

import '../utils/constants.dart';

/// Zeigt eine Fehlermeldung mit Retry-Button an
class ErrorView extends StatelessWidget {
  const ErrorView({required this.message, required this.onRetry, super.key});

  final String message;
  final VoidCallback onRetry;

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
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: AppConstants.spacingL),
            ElevatedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh),
              label: const Text('Erneut versuchen'),
            ),
          ],
        ),
      ),
    );
  }
}
