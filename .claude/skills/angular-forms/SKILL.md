---
name: angular-forms
description: >
  reactive forms, FormGroup, FormControl, FormBuilder, formControlName,
  [formGroup], (ngSubmit), Validators, ReactiveFormsModule, form validation,
  markAllAsTouched, AbstractControl, ValidationErrors, ValidatorFn,
  angular forms, form reset, form state — Reactive Forms mit FormBuilder,
  Validators und Error-Anzeige in Angular
---

## Angular Reactive Forms

### Setup

```typescript
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";

@Component({
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFormComponent {
  fb = inject(FormBuilder);

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    console.log(this.form.value);
  }
}
```

### Template

```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="email" type="email" />
  <input formControlName="password" type="password" />
  <button [disabled]="form.invalid" type="submit">Submit</button>
</form>
```

### Getter-Pattern — typischer Zugriff auf Controls

Getter im TypeScript anlegen, damit Templates schlanker werden:

```typescript
get email() {
  return this.form.get('email');
}

get password() {
  return this.form.get('password');
}
```

Im Template dann direkt nutzen:

```html
@if (email?.touched && email?.invalid) {
<p class="field-error">{{ email?.errors | json }}</p>
}
```

### Validators — Übersicht

| Validator                     | Beschreibung  |
| ----------------------------- | ------------- |
| `Validators.required`         | Pflichtfeld   |
| `Validators.email`            | E-Mail-Format |
| `Validators.minLength(n)`     | Mindestlänge  |
| `Validators.maxLength(n)`     | Maximallänge  |
| `Validators.pattern(/regex/)` | Regex-Muster  |

### Error-Anzeige — touched-first Pattern

Fehler **immer erst nach Nutzer-Interaktion** zeigen (`touched`), nicht beim Laden:

```html
@if (email?.touched && email?.hasError('required')) {
<p class="field-error">E-Mail ist Pflichtfeld.</p>
} @if (email?.touched && email?.hasError('email')) {
<p class="field-error">Bitte eine gültige E-Mail eingeben.</p>
} @if (password?.touched && password?.hasError('minlength')) {
<p class="field-error">
  Mindestens {{ password?.getError('minlength')?.requiredLength }} Zeichen.
</p>
}
```

### Form State Properties

| Property                  | Beschreibung                                    |
| ------------------------- | ----------------------------------------------- |
| `.value`                  | Aktueller Wert des Controls                     |
| `.valid` / `.invalid`     | Alle Validatoren erfüllt / mind. einer verletzt |
| `.touched` / `.untouched` | Feld wurde fokussiert und verlassen (Blur)      |
| `.dirty` / `.pristine`    | Wert wurde verändert / noch im Ursprungszustand |
| `.errors`                 | Fehler-Objekt oder `null`                       |

Gilt für einzelne Controls (`form.get('email')`) **und** die gesamte FormGroup (`form`).

### Control-Methoden

```typescript
// Wert lesen
this.form.get("email")?.value;

// Disable / Enable
this.form.get("email")?.disable();
this.form.get("email")?.enable();

// Form zurücksetzen (leer)
this.form.reset();

// Form zurücksetzen (mit Vorbelegung)
this.form.reset({ email: "test@example.com", password: "" });

// Alle Controls als touched markieren (zeigt alle Fehler)
this.form.markAllAsTouched();
```

### Custom Validator

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function forbiddenValueValidator(forbidden: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    control.value === forbidden
      ? { forbiddenValue: { value: control.value } }
      : null;
}

// Verwendung im FormBuilder
form = this.fb.group({
  username: ["", [Validators.required, forbiddenValueValidator("admin")]],
});
```

Im Template:

```html
@if (username?.touched && username?.hasError('forbiddenValue')) {
<p class="field-error">Dieser Name ist nicht erlaubt.</p>
}
```

### Vollständiges Beispiel

```typescript
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";

export function forbiddenNameValidator(name: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    control.value === name ? { forbiddenName: { value: control.value } } : null;
}

@Component({
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  fb = inject(FormBuilder);

  userForm = this.fb.group({
    firstname: [
      "",
      [
        forbiddenNameValidator("Paul"),
        Validators.required,
        Validators.minLength(4),
      ],
    ],
    email: ["", [Validators.required, Validators.email]],
  });

  get firstname() {
    return this.userForm.get("firstname");
  }
  get email() {
    return this.userForm.get("email");
  }

  submit(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) return;
    console.log(this.userForm.value);
  }

  reset(): void {
    this.userForm.reset();
  }
}
```
