import 'package:flutter_riverpod/flutter_riverpod.dart';

enum AppTheme { light, dark, system }

class ThemeNotifier extends StateNotifier<AppTheme> {
  ThemeNotifier() : super(AppTheme.light);

  void setTheme(AppTheme theme) {
    state = theme;
  }

  void toggleTheme() {
    state = state == AppTheme.light ? AppTheme.dark : AppTheme.light;
  }
}

final themeProvider = StateNotifierProvider<ThemeNotifier, AppTheme>((ref) {
  return ThemeNotifier();
});

final selectedCategoryProvider = StateProvider<String>((ref) => 'All');
