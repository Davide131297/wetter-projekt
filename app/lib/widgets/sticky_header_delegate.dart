import 'package:flutter/material.dart';

/// SliverPersistentHeaderDelegate für sticky Headers
class StickyHeaderDelegate extends SliverPersistentHeaderDelegate {
  const StickyHeaderDelegate({required this.child, this.height = 200});

  final Widget child;
  final double height;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return child;
  }

  @override
  double get maxExtent => height;

  @override
  double get minExtent => height;

  @override
  bool shouldRebuild(covariant StickyHeaderDelegate oldDelegate) => false;
}
