import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:freshalert_flutter/models/product.dart';
import 'package:freshalert_flutter/data/sample_products.dart';
import 'package:freshalert_flutter/utils/product_helpers.dart';

class ProductsNotifier extends StateNotifier<List<Product>> {
  ProductsNotifier() : super(sampleProducts);

  void addProduct({
    required String name,
    required ProductCategory category,
    required String location,
    required DateTime expiryDate,
    String? notes,
  }) {
    final status = getProductStatus(expiryDate);
    final product = Product(
      name: name,
      category: category,
      location: location,
      expiryDate: expiryDate,
      notes: notes,
      status: status,
    );
    state = [product, ...state];
  }

  void updateProduct(String id, Product updated) {
    state = [
      for (final product in state)
        if (product.id == id) updated else product,
    ];
  }

  void deleteProduct(String id) {
    state = state.where((p) => p.id != id).toList();
  }

  void deleteAllProducts() {
    state = [];
  }

  List<Product> getProductsByCategory(String category) {
    if (category == 'All') return state;
    if (category == 'Expired') {
      return state.where((p) => p.status == ProductStatus.expired).toList();
    }
    
    final categoryEnum = getCategoryFromName(category);
    return state.where((p) => p.category == categoryEnum).toList();
  }

  Map<String, int> getSummaryStats() {
    return {
      'expired': state.where((p) => p.status == ProductStatus.expired).length,
      'soon': state.where((p) => p.status == ProductStatus.soon).length,
      'fresh': state.where((p) => p.status == ProductStatus.safe).length,
      'total': state.length,
    };
  }
}

final productsProvider =
    StateNotifierProvider<ProductsNotifier, List<Product>>((ref) {
  return ProductsNotifier();
});

final summaryStatsProvider = Provider((ref) {
  final products = ref.watch(productsProvider);
  return {
    'expired': products.where((p) => p.status == ProductStatus.expired).length,
    'soon': products.where((p) => p.status == ProductStatus.soon).length,
    'fresh': products.where((p) => p.status == ProductStatus.safe).length,
    'total': products.length,
  };
});

final productsByStatusProvider = Provider.family<List<Product>, String>((ref, status) {
  final products = ref.watch(productsProvider);
  if (status == 'all') return products;
  if (status == 'expired') {
    return products.where((p) => p.status == ProductStatus.expired).toList();
  }
  if (status == 'soon') {
    return products.where((p) => p.status == ProductStatus.soon).toList();
  }
  return products.where((p) => p.status == ProductStatus.safe).toList();
});

final productsByNameProvider = Provider.family<List<Product>, String>((ref, query) {
  final products = ref.watch(productsProvider);
  if (query.isEmpty) return products;
  return products
      .where((p) => p.name.toLowerCase().contains(query.toLowerCase()))
      .toList();
});
