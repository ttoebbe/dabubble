---
name: typescript-standards
description: >
  TypeScript, tsconfig, strict mode, interface, type alias, any, export default,
  named export, union type, literal type, explicit typing, function signature,
  typescript standards, typescript rules — TypeScript-Standards für strikte,
  typsichere Codebasis
---

## TypeScript Standards

### tsconfig.json — Pflicht-Flags

`strict: true` ist immer gesetzt. Zusätzlich:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true
  }
}
```

### Typisierung

Alle Parameter und Rückgabewerte explizit typisieren — kein Implicit Any:

```typescript
// SCHLECHT
function getUser(id) {
  return fetch(`/api/users/${id}`).then((r) => r.json());
}

// GUT
async function getUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json() as User;
}
```

### interface vs. type

`interface` für Objektstrukturen bevorzugen:

```typescript
// GUT — erweiterbar, klar lesbar
interface UserProfile {
  id: number;
  name: string;
  email: string;
}

// Nur für Unions, Intersections oder primitive Aliases
type Status = "active" | "inactive" | "banned";
type ID = string | number;
```

### any vermeiden

Union Types und Literal Types gezielt einsetzen:

```typescript
// SCHLECHT
function process(input: any): any { ... }

// GUT
function process(input: string | number): string { ... }

// Wenn Typ wirklich unbekannt: unknown statt any
function parse(raw: unknown): UserProfile {
  if (!isUserProfile(raw)) throw new Error('Invalid data');
  return raw;
}
```

### Exports

Named Exports bevorzugen — Default Export nur wenn ein Framework es erfordert:

```typescript
// GUT — explizit, tree-shakeable
export interface UserProfile { ... }
export function getUserById(id: number): Promise<UserProfile> { ... }
export class UserService { ... }

// SCHLECHT (außer bei Framework-Anforderung wie Angular @Component)
export default class UserService { ... }
```

### Readonly & Immutability

```typescript
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

// Arrays die nicht verändert werden sollen
function renderList(items: readonly string[]): void { ... }
```

### Generics sinnvoll einsetzen

```typescript
// Wiederverwendbare API-Response-Struktur
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> { ... }
```
