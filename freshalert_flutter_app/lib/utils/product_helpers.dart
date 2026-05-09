import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:freshalert_flutter/models/product.dart';

int getDaysRemaining(DateTime expiryDate) {
  final now = DateTime.now();
  final difference = expiryDate.difference(now);
  return difference.inDays + (difference.inHours % 24 > 0 ? 1 : 0);
}

ProductStatus getProductStatus(DateTime expiryDate) {
  final days = getDaysRemaining(expiryDate);
  if (days < 0) return ProductStatus.expired;
  if (days <= 7) return ProductStatus.soon;
  return ProductStatus.safe;
}

String formatDaysLabel(int days) {
  if (days < 0) return '${days.abs()}d ago';
  if (days == 0) return 'Today';
  if (days == 1) return 'Tomorrow';
  return '$days days';
}

String formatExpiryDate(DateTime date) {
  return DateFormat('MMM dd, yyyy').format(date);
}

String formatExpiryDateShort(DateTime date) {
  return DateFormat('MMM dd').format(date);
}

class StatusConfig {
  final String label;
  final Color color;
  final Color bgColor;
  final Color textColor;

  const StatusConfig({
    required this.label,
    required this.color,
    required this.bgColor,
    required this.textColor,
  });
}

final Map<ProductStatus, StatusConfig> statusConfig = {
  ProductStatus.safe: StatusConfig(
    label: 'Fresh',
    color: const Color(0xFF4CAF50),
    bgColor: const Color(0xFF4CAF50).withAlpha(26),
    textColor: const Color(0xFF4CAF50),
  ),
  ProductStatus.soon: StatusConfig(
    label: 'Expiring Soon',
    color: const Color(0xFFFF9800),
    bgColor: const Color(0xFFFF9800).withAlpha(26),
    textColor: const Color(0xFFFF9800),
  ),
  ProductStatus.expired: StatusConfig(
    label: 'Expired',
    color: const Color(0xFFF44336),
    bgColor: const Color(0xFFF44336).withAlpha(26),
    textColor: const Color(0xFFF44336),
  ),
};

const Map<ProductCategory, String> categoryIcons = {
  ProductCategory.food: '🥦',
  ProductCategory.medicine: '💊',
  ProductCategory.daily: '🧴',
  ProductCategory.grocery: '🛒',
  ProductCategory.wrongItem: '❌',
};

const Map<String, String> locationIcons = {
  'Fridge': '❄️',
  'Pantry': '🗄️',
  'Cabinet': '🗃️',
  'Freezer': '🧊',
  'Bathroom': '🛁',
};

String getCategoryName(ProductCategory category) {
  switch (category) {
    case ProductCategory.food:
      return 'Food';
    case ProductCategory.medicine:
      return 'Medicine';
    case ProductCategory.daily:
      return 'Daily';
    case ProductCategory.grocery:
      return 'Grocery';
    case ProductCategory.wrongItem:
      return 'Wrong Item';
  }
}

ProductCategory getCategoryFromName(String name) {
  switch (name) {
    case 'Food':
      return ProductCategory.food;
    case 'Medicine':
      return ProductCategory.medicine;
    case 'Daily':
      return ProductCategory.daily;
    case 'Grocery':
      return ProductCategory.grocery;
    case 'Wrong Item':
      return ProductCategory.wrongItem;
    default:
      return ProductCategory.food;
  }
}
