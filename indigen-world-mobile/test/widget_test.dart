import 'package:flutter_test/flutter_test.dart';

import 'package:indigen_world_mobile/app/app.dart';

void main() {
  testWidgets('App boots into the five-tab home shell',
      (WidgetTester tester) async {
    await tester.pumpWidget(const IndigenWorldApp());

    expect(find.text('Indigen World'), findsWidgets);
    expect(find.text('Word of the day'), findsOneWidget);

    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Explore'), findsOneWidget);
    expect(find.text('Learn'), findsOneWidget);
    expect(find.text('Contribute'), findsOneWidget);
    expect(find.text('Profile'), findsOneWidget);
  });
}
