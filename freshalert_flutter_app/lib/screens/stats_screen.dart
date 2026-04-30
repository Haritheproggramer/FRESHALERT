import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:freshalert_flutter/providers/products_provider.dart';
import 'package:freshalert_flutter/widgets/app_bottom_nav.dart';
import 'package:freshalert_flutter/widgets/stat_card.dart';

class StatsScreen extends ConsumerWidget {
  const StatsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stats = ref.watch(summaryStatsProvider);
    final products = ref.watch(productsProvider);

    final totalFresh = stats['fresh'] ?? 0;
    final totalSoon = stats['soon'] ?? 0;
    final totalExpired = stats['expired'] ?? 0;
    final total = stats['total'] ?? 0;

    final freshPercent =
        total > 0 ? (totalFresh / total * 100).toStringAsFixed(1) : '0';
    final soonPercent =
        total > 0 ? (totalSoon / total * 100).toStringAsFixed(1) : '0';
    final expiredPercent =
        total > 0 ? (totalExpired / total * 100).toStringAsFixed(1) : '0';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Statistics'),
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Overall stats
                Text(
                  'Overview',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: StatCard(
                        count: totalFresh,
                        label: 'Fresh',
                        bgColor: const Color(0xFF4CAF50).withAlpha(26),
                        textColor: const Color(0xFF4CAF50),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: StatCard(
                        count: totalSoon,
                        label: 'Soon',
                        bgColor: const Color(0xFFFF9800).withAlpha(26),
                        textColor: const Color(0xFFFF9800),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: StatCard(
                        count: totalExpired,
                        label: 'Expired',
                        bgColor: const Color(0xFFF44336).withAlpha(26),
                        textColor: const Color(0xFFF44336),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Percentage breakdown
                Text(
                  'Distribution',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 16),
                _buildStatRow(
                  context,
                  '🥦 Fresh',
                  '$freshPercent%',
                  totalFresh,
                  const Color(0xFF4CAF50),
                ),
                const SizedBox(height: 12),
                _buildStatRow(
                  context,
                  '⏰ Expiring Soon',
                  '$soonPercent%',
                  totalSoon,
                  const Color(0xFFFF9800),
                ),
                const SizedBox(height: 12),
                _buildStatRow(
                  context,
                  '❌ Expired',
                  '$expiredPercent%',
                  totalExpired,
                  const Color(0xFFF44336),
                ),
                const SizedBox(height: 24),

                // Category breakdown
                if (products.isNotEmpty) ...[
                  Text(
                    'By Category',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 16),
                  ..._buildCategoryStats(context, products),
                ],
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: const AppBottomNav(currentIndex: 2),
    );
  }

  Widget _buildStatRow(
    BuildContext context,
    String label,
    String percentage,
    int count,
    Color color,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
            ),
            Text(
              '$percentage ($count items)',
              style: Theme.of(context).textTheme.labelSmall,
            ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: LinearProgressIndicator(
            value: double.parse(percentage) / 100,
            minHeight: 8,
            backgroundColor: color.withAlpha(51),
            valueColor: AlwaysStoppedAnimation<Color>(color),
          ),
        ),
      ],
    );
  }

  List<Widget> _buildCategoryStats(BuildContext context, List products) {
    final categories = {'Food': 0, 'Medicine': 0, 'Daily': 0};

    for (final product in products) {
      final categoryName = getCategoryName(product.category);
      categories[categoryName] = (categories[categoryName] ?? 0) + 1;
    }

    return categories.entries
        .map((entry) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _buildStatRow(
                context,
                '${getEmoji(entry.key)} ${entry.key}',
                '${(entry.value / products.length * 100).toStringAsFixed(1)}%',
                entry.value,
                getColorForCategory(entry.key),
              ),
            ))
        .toList();
  }

  String getCategoryName(category) {
    switch (category) {
      case 'food':
        return 'Food';
      case 'medicine':
        return 'Medicine';
      case 'daily':
        return 'Daily';
      default:
        return 'Food';
    }
  }

  String getEmoji(String category) {
    switch (category) {
      case 'Food':
        return '🍕';
      case 'Medicine':
        return '💊';
      case 'Daily':
        return '🧴';
      default:
        return '📦';
    }
  }

  Color getColorForCategory(String category) {
    switch (category) {
      case 'Food':
        return const Color(0xFF4CAF50);
      case 'Medicine':
        return const Color(0xFF2196F3);
      case 'Daily':
        return const Color(0xFFFF9800);
      default:
        return const Color(0xFF9C27B0);
    }
  }
}
