import 'package:flutter/material.dart';
import 'package:freshalert_flutter/models/product.dart';
import 'package:freshalert_flutter/utils/product_helpers.dart';

class ProductCard extends StatefulWidget {
  final Product product;
  final VoidCallback onTap;
  final VoidCallback onDelete;
  final int index;

  const ProductCard({
    Key? key,
    required this.product,
    required this.onTap,
    required this.onDelete,
    required this.index,
  }) : super(key: key);

  @override
  State<ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends State<ProductCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _slideController;
  bool _showDelete = false;

  @override
  void initState() {
    super.initState();
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _slideController.dispose();
    super.dispose();
  }

  void _toggleDelete() {
    if (_showDelete) {
      _slideController.reverse();
    } else {
      _slideController.forward();
    }
    setState(() => _showDelete = !_showDelete);
  }

  @override
  Widget build(BuildContext context) {
    final config = statusConfig[widget.product.status]!;
    final days = getDaysRemaining(widget.product.expiryDate);
    final daysLabel = formatDaysLabel(days);
    final categoryIcon = categoryIcons[widget.product.category] ?? '📦';
    final locationIcon =
        locationIcons[widget.product.location] ?? '📍';

    return GestureDetector(
      onTap: _showDelete ? _toggleDelete : widget.onTap,
      onLongPress: _toggleDelete,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(13),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Delete background
            if (_showDelete)
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.red[400],
                    borderRadius: BorderRadius.circular(20),
                  ),
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(right: 16),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.delete, color: Colors.white, size: 24),
                      const SizedBox(height: 4),
                      const Text(
                        'Delete',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            // Main content
            SlideTransition(
              position: Tween<Offset>(
                begin: Offset.zero,
                end: const Offset(-0.15, 0),
              ).animate(_slideController),
              child: Container(
                decoration: BoxDecoration(
                  color: Theme.of(context).cardColor,
                  borderRadius: BorderRadius.circular(20),
                ),
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    // Icon
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: config.bgColor,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      alignment: Alignment.center,
                      child: Text(categoryIcon, style: const TextStyle(fontSize: 24)),
                    ),
                    const SizedBox(width: 12),
                    // Product info
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            widget.product.name,
                            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Text(
                                locationIcon,
                                style: const TextStyle(fontSize: 12),
                              ),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  widget.product.location,
                                  style: Theme.of(context)
                                      .textTheme
                                      .labelSmall,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            formatExpiryDate(widget.product.expiryDate),
                            style: Theme.of(context)
                                .textTheme
                                .labelSmall,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    // Days badge
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: config.bgColor,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            daysLabel,
                            style: Theme.of(context)
                                .textTheme
                                .labelSmall
                                ?.copyWith(
                                  color: config.textColor,
                                  fontWeight: FontWeight.w600,
                                ),
                          ),
                        ),
                        const SizedBox(height: 6),
                        GestureDetector(
                          onTap: _toggleDelete,
                          child: Padding(
                            padding: const EdgeInsets.all(4),
                            child: Text(
                              '···',
                              style: TextStyle(
                                color: Colors.grey[400],
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
