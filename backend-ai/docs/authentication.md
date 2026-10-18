# Authentication architecture

Authentication is prepared but not connected to production in the MVP apps.

## MVP model

- TribeStudio includes sign in, sign up, forgot password, Google button, phone
  button and demo mode UI.
- Production Firebase Authentication is inactive.
- Firestore role strings are documented for local/emulator scaffolding.
- Prototype rules prevent users from creating privileged roles for themselves.

## Roles

`user`, `contributor`, `creator`, `validator`, `elder`,
`cultural custodian`, `community manager`, `administrator`, `researcher`,
`partner`.

## Production hardening

- Move trusted role assignment to custom claims or admin-only Functions before
  launch.
- Enable App Check before broadly sharing production clients.
- Consider re-authentication for sensitive profile, consent and review actions.
- Add audit logging for role changes and sensitive content access.
