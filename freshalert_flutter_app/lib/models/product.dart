import 'package:uuid/uuid.dart';

enum ProductStatus { safe, soon, expired }

enum ProductCategory { food, medicine, daily }

class Product {
  final String id;
  final String name;
  final ProductCategory category;
  final String location;
  final DateTime expiryDate;
  final DateTime? openedDate;
  final String? photo;
  final String? notes;
  final ProductStatus status;
  final DateTime createdAt;

  Product({
    String? id,
    required this.name,
    required this.category,
    required this.location,
    required this.expiryDate,
    this.openedDate,
    this.photo,
    this.notes,
    required this.status,
    DateTime? createdAt,
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();

  Product copyWith({
    String? id,
    String? name,
    ProductCategory? category,
    String? location,
    DateTime? expiryDate,
    DateTime? openedDate,
    String? photo,
    String? notes,
    ProductStatus? status,
    DateTime? createdAt,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      location: location ?? this.location,
      expiryDate: expiryDate ?? this.expiryDate,
      openedDate: openedDate ?? this.openedDate,
      photo: photo ?? this.photo,
      notes: notes ?? this.notes,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
