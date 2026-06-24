import 'package:flutter_test/flutter_test.dart';

import 'package:indigen_world_mobile/app/app.dart';

void main() {
  testWidgets('App boots into the home shell', (WidgetTester tester) async {
    await tester.pumpWidget(const IndigenWorldApp());

    // Home is the default destination.
    expect(find.text('Welcome to Indigen World'), findsOneWidget);

    // Bottom navigation destinations are present.
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Explore'), findsOneWidget);
    expect(find.text('Profile'), findsOneWidget);
  });
}
