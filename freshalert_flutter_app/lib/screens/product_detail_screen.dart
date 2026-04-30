import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:freshalert_flutter/models/product.dart';
import 'package:freshalert_flutter/providers/products_provider.dart';
import 'package:freshalert_flutter/utils/product_helpers.dart';

class ProductDetailScreen extends ConsumerStatefulWidget {
  final String productId;

  const ProductDetailScreen({super.key, required this.productId});

  @override
  ConsumerState<ProductDetailScreen> createState() =>
      _ProductDetailScreenState();
}

class _ProductDetailScreenState extends ConsumerState<ProductDetailScreen> {
  late TextEditingController _nameController;
  late TextEditingController _notesController;
  DateTime? _selectedDate;
  ProductCategory? _selectedCategory;
  String? _selectedLocation;
  bool _isEditing = false;
  bool _isSaving = false;

  final List<String> _locations = [
    'Fridge',
    'Pantry',
    'Cabinet',
    'Freezer',
    'Bathroom'
  ];

  Product? _product;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _notesController = TextEditingController();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _loadProduct() {
    final products = ref.read(productsProvider);
    final product =
        products.firstWhere((p) => p.id == widget.productId, orElse: () {
      Future.microtask(() {
        if (mounted) context.pop();
      });
      return products.first;
    });
    _product = product;
    if (_product != null) {
      _nameController.text = _product!.name;
      _notesController.text = _product!.notes ?? '';
      _selectedDate = _product!.expiryDate;
      _selectedCategory = _product!.category;
      _selectedLocation = _product!.location;
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 365)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  void _saveChanges() {
    if (_nameController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter product name')),
      );
      return;
    }

    if (_selectedDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select expiry date')),
      );
      return;
    }

    setState(() => _isSaving = true);

    Future.delayed(const Duration(milliseconds: 500), () {
      final updatedProduct = _product!.copyWith(
        name: _nameController.text,
        category: _selectedCategory ?? ProductCategory.food,
        location: _selectedLocation ?? 'Fridge',
        expiryDate: _selectedDate!,
        notes:
            _notesController.text.isEmpty ? null : _notesController.text,
        status: getProductStatus(_selectedDate!),
      );

      ref
          .read(productsProvider.notifier)
          .updateProduct(widget.productId, updatedProduct);

      if (!mounted) {
        return;
      }

      setState(() {
        _isSaving = false;
        _isEditing = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Product updated successfully')),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    _loadProduct();

    if (_product == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Product Details'),
        ),
        body: const Center(
          child: Text('Product not found'),
        ),
      );
    }

    final config = statusConfig[_product!.status]!;
    final days = getDaysRemaining(_product!.expiryDate);
    final categoryIcon = categoryIcons[_product!.category] ?? '📦';
    final locationIcon = locationIcons[_product!.location] ?? '📍';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Details'),
        elevation: 0,
        actions: [
          if (!_isEditing)
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () => setState(() => _isEditing = true),
            )
          else
            IconButton(
              icon: const Icon(Icons.close),
              onPressed: () => setState(() => _isEditing = false),
            ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            if (!_isEditing) ...[
              // Hero section
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: config.bgColor,
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      config.bgColor,
                      config.bgColor.withAlpha(128),
                    ],
                  ),
                ),
                child: Column(
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(230),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withAlpha(51),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          categoryIcon,
                          style: const TextStyle(fontSize: 60),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      _product!.name,
                      style:
                          Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: config.textColor,
                              ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withAlpha(204),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        config.label,
                        style:
                            Theme.of(context).textTheme.labelSmall?.copyWith(
                                  color: config.textColor,
                                  fontWeight: FontWeight.bold,
                                ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Details section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildDetailRow(
                      context,
                      'Category',
                      getCategoryName(_product!.category),
                    ),
                    const SizedBox(height: 16),
                    _buildDetailRow(
                      context,
                      'Location',
                      _product!.location,
                      icon: locationIcon,
                    ),
                    const SizedBox(height: 16),
                    _buildDetailRow(
                      context,
                      'Expiry Date',
                      formatExpiryDate(_product!.expiryDate),
                      icon: '📅',
                    ),
                    const SizedBox(height: 16),
                    _buildDetailRow(
                      context,
                      'Days Remaining',
                      formatDaysLabel(days),
                      color: config.textColor,
                    ),
                    if (_product!.notes != null && _product!.notes!.isNotEmpty)
                      ...[
                        const SizedBox(height: 16),
                        _buildDetailRow(
                          context,
                          'Notes',
                          _product!.notes!,
                        ),
                      ],
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton.tonal(
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: const Text('Delete Product?'),
                              content: Text(
                                'Are you sure you want to delete ${_product!.name}?',
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('Cancel'),
                                ),
                                FilledButton(
                                  onPressed: () {
                                    ref
                                        .read(productsProvider.notifier)
                                        .deleteProduct(_product!.id);
                                    Navigator.pop(context);
                                    context.pop();
                                    ScaffoldMessenger.of(context)
                                        .showSnackBar(
                                          SnackBar(
                                            content: Text(
                                              '${_product!.name} deleted',
                                            ),
                                          ),
                                        );
                                  },
                                  child: const Text('Delete'),
                                ),
                              ],
                            ),
                          );
                        },
                        child: const Text('Delete Product'),
                      ),
                    ),
                  ],
                ),
              ),
            ] else ...[
              // Edit form
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Product name
                    TextField(
                      controller: _nameController,
                      decoration: InputDecoration(
                        labelText: 'Product Name',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        prefixIcon: const Icon(Icons.label),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Category
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Category',
                          style: Theme.of(context).textTheme.labelMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            for (final category in ProductCategory.values)
                              Expanded(
                                child: GestureDetector(
                                  onTap: () =>
                                      setState(() =>
                                          _selectedCategory = category),
                                  child: Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: _selectedCategory == category
                                          ? Theme.of(context).primaryColor
                                          : Colors.grey[200],
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Column(
                                      children: [
                                        Text(
                                          categoryIcons[category] ?? '📦',
                                          style: const TextStyle(fontSize: 24),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          getCategoryName(category),
                                          style: TextStyle(
                                            fontSize: 12,
                                            color:
                                                _selectedCategory == category
                                                    ? Colors.white
                                                    : Colors.black,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                          ]
                              .map((w) => Expanded(child: w))
                              .toList(),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Location
                    DropdownButtonFormField<String>(
                      initialValue: _selectedLocation,
                      items: _locations
                          .map((loc) => DropdownMenuItem(
                                value: loc,
                                child: Text(loc),
                              ))
                          .toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setState(() => _selectedLocation = value);
                        }
                      },
                      decoration: InputDecoration(
                        labelText: 'Location',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        prefixIcon: const Icon(Icons.location_on),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Expiry date
                    GestureDetector(
                      onTap: () => _selectDate(context),
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey[300]!),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.calendar_today,
                                color: Colors.grey[600]),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Expiry Date',
                                  style: Theme.of(context)
                                      .textTheme
                                      .labelSmall,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _selectedDate != null
                                      ? formatExpiryDate(_selectedDate!)
                                      : 'Select a date',
                                  style: Theme.of(context)
                                      .textTheme
                                      .titleSmall,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Notes
                    TextField(
                      controller: _notesController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        labelText: 'Notes (Optional)',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        prefixIcon: const Icon(Icons.note),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Save button
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton(
                        onPressed: _isSaving ? null : _saveChanges,
                        style: FilledButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: _isSaving
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor:
                                      AlwaysStoppedAnimation(Colors.white),
                                ),
                              )
                            : const Text('Save Changes'),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(
    BuildContext context,
    String label,
    String value, {
    String? icon,
    Color? color,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.labelMedium?.copyWith(
                color: Colors.grey[600],
              ),
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            if (icon != null)
              Text(
                icon,
                style: const TextStyle(fontSize: 18),
              ),
            if (icon != null) const SizedBox(width: 8),
            Expanded(
              child: Text(
                value,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: color,
                    ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
