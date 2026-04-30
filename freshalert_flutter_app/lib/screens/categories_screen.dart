import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:freshalert_flutter/models/product.dart';
import 'package:freshalert_flutter/providers/products_provider.dart';
import 'package:freshalert_flutter/utils/product_helpers.dart';
import 'package:freshalert_flutter/widgets/product_card.dart';
import 'package:freshalert_flutter/widgets/app_bottom_nav.dart';

class CategoriesScreen extends ConsumerStatefulWidget {
  const CategoriesScreen({super.key});

  @override
  ConsumerState<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends ConsumerState<CategoriesScreen> {
  String _selectedCategory = 'All';

  @override
  Widget build(BuildContext context) {
    final products = ref.watch(productsProvider);
    
    List<Product> filteredProducts;
    if (_selectedCategory == 'All') {
      filteredProducts = products;
    } else if (_selectedCategory == 'Expired') {
      filteredProducts = products.where((p) => p.status == ProductStatus.expired).toList();
    } else {
      final category = getCategoryFromName(_selectedCategory);
      filteredProducts = products.where((p) => p.category == category).toList();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Categories'),
        elevation: 0,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Category chips
            SizedBox(
              height: 60,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  _buildCategoryChip('All'),
                  _buildCategoryChip('Food'),
                  _buildCategoryChip('Medicine'),
                  _buildCategoryChip('Daily'),
                  _buildCategoryChip('Expired'),
                ]
                    .map((chip) => Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: chip,
                        ))
                    .toList(),
              ),
            ),
            const SizedBox(height: 16),
            // Products list
            if (filteredProducts.isEmpty)
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.inbox_outlined,
                        size: 64,
                        color: Colors.grey[300],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'No products in this category',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                ),
              )
            else
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: filteredProducts.length,
                  itemBuilder: (context, index) {
                    final product = filteredProducts[index];
                    return ProductCard(
                      product: product,
                      index: index,
                      onTap: () {
                        context.push('/product/${product.id}');
                      },
                      onDelete: () {
                        ref
                            .read(productsProvider.notifier)
                            .deleteProduct(product.id);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('${product.name} removed'),
                            duration: const Duration(seconds: 3),
                          ),
                        );
                      },
                    );
                  },
                ),
              ),
          ],
        ),
      ),
      bottomNavigationBar: const AppBottomNav(currentIndex: 1),
    );
  }

  Widget _buildCategoryChip(String category) {
    final isSelected = _selectedCategory == category;
    return FilterChip(
      label: Text(category),
      selected: isSelected,
      onSelected: (selected) {
        setState(() => _selectedCategory = category);
      },
      backgroundColor: Colors.grey[200],
      selectedColor: Theme.of(context).primaryColor,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black,
        fontWeight: FontWeight.w600,
      ),
    );
  }
}
