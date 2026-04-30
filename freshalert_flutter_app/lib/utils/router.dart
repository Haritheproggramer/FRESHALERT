import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:freshalert_flutter/screens/splash_screen.dart';
import 'package:freshalert_flutter/screens/dashboard_screen.dart';
import 'package:freshalert_flutter/screens/add_product_screen.dart';
import 'package:freshalert_flutter/screens/categories_screen.dart';
import 'package:freshalert_flutter/screens/product_detail_screen.dart';
import 'package:freshalert_flutter/screens/stats_screen.dart';
import 'package:freshalert_flutter/screens/settings_screen.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/',
      name: 'dashboard',
      builder: (context, state) => const DashboardScreen(),
    ),
    GoRoute(
      path: '/add',
      name: 'add',
      builder: (context, state) => const AddProductScreen(),
    ),
    GoRoute(
      path: '/categories',
      name: 'categories',
      builder: (context, state) => const CategoriesScreen(),
    ),
    GoRoute(
      path: '/product/:id',
      name: 'product-detail',
      builder: (context, state) => ProductDetailScreen(
        productId: state.pathParameters['id'] ?? '',
      ),
    ),
    GoRoute(
      path: '/stats',
      name: 'stats',
      builder: (context, state) => const StatsScreen(),
    ),
    GoRoute(
      path: '/settings',
      name: 'settings',
      builder: (context, state) => const SettingsScreen(),
    ),
  ],
  errorBuilder: (context, state) => Scaffold(
    appBar: AppBar(title: const Text('Error')),
    body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error, size: 48),
          const SizedBox(height: 16),
          Text('Page not found: ${state.uri}'),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => context.go('/'),
            child: const Text('Go Home'),
          ),
        ],
      ),
    ),
  ),
);
