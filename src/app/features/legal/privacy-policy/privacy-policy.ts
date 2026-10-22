import { Component } from '@angular/core';

/** One heading with its paragraph in the privacy policy. */
interface PrivacySection {
  readonly title: string;
  readonly text: string;
}

/**
 * Draft of the privacy policy for what DABubble actually processes (decision Thomas 22.10.2026).
 * Not legal advice: the team checks it before submission; names and address come from the
 * imprint.
 */
const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  {
    title: 'Verantwortlich',
    text:
      'Verantwortlich für die Verarbeitung deiner Daten in DABubble sind die im Impressum ' +
      'genannten Personen. Dort findest du auch die E-Mail-Adresse für alle Fragen zum Datenschutz.',
  },
  {
    title: 'Worum es geht',
    text:
      'DABubble ist ein Lernprojekt der Developer Akademie: ein Team-Messenger mit Channels und ' +
      'Direktnachrichten. Wir verarbeiten nur die Daten, die für die Nutzung der App nötig sind. ' +
      'Es gibt keine Werbung, keine Analyse-Tools und kein Tracking.',
  },
  {
    title: 'Konto und Profil',
    text:
      'Für ein Konto speichern wir deinen Namen, deine E-Mail-Adresse, deinen gewählten Avatar ' +
      'und deinen Online-Status (aktiv oder abwesend). Dein Passwort verwaltet Firebase ' +
      'Authentication, wir sehen es nicht. Name, Avatar, E-Mail-Adresse und Online-Status sind ' +
      'für alle angemeldeten Personen in DABubble sichtbar. Rechtsgrundlage ist Art. 6 Abs. 1 ' +
      'lit. b DSGVO (Bereitstellung der App).',
  },
  {
    title: 'Gäste-Login',
    text:
      'Beim Gäste-Login legt Firebase ein anonymes Konto mit dem Namen „Gast“ an. Wenn du dich ' +
      'abmeldest, löschen wir dieses Konto und sein Profil.',
  },
  {
    title: 'Anmeldung mit Google',
    text:
      'Meldest du dich mit Google an, übermittelt Google uns deinen Namen, deine E-Mail-Adresse ' +
      'und eine Konto-Kennung. Anbieter ist die Google Ireland Limited, Gordon House, Barrow ' +
      'Street, Dublin 4, Irland. Es gilt zusätzlich die Datenschutzerklärung von Google.',
  },
  {
    title: 'Channels und Nachrichten',
    text:
      'Channels mit Name, Beschreibung und Mitgliedern sowie Nachrichten und Reaktionen werden ' +
      'gespeichert, damit alle Mitglieder sie sehen. Neue Konten treten automatisch dem Channel ' +
      '„Entwicklerteam“ bei; du kannst ihn jederzeit verlassen.',
  },
  {
    title: 'Firebase',
    text:
      'Konten und Inhalte liegen bei Google Firebase (Firebase Authentication und Cloud ' +
      'Firestore) der Google Ireland Limited. Die Datenbank steht in Frankfurt am Main. Eine ' +
      'Übermittlung in die USA ist nicht ausgeschlossen; Google ist dafür nach dem EU-US Data ' +
      'Privacy Framework zertifiziert.',
  },
  {
    title: 'Speicherung im Browser',
    text:
      'Damit du angemeldet bleibst, speichert Firebase deinen Anmeldestatus im Speicher deines ' +
      'Browsers. Wir setzen keine Cookies zu Werbe- oder Analysezwecken.',
  },
  {
    title: 'Hosting',
    text:
      'Die Website liegt auf einem Webspace der Developer Akademie. Beim Aufruf können dort ' +
      'technisch nötige Zugriffsdaten wie IP-Adresse, Zeitpunkt und Browser in Logdateien ' +
      'gespeichert werden.',
  },
  {
    title: 'Speicherdauer',
    text:
      'Wir speichern deine Daten, solange dein Konto besteht. Gastkonten löschen wir beim ' +
      'Abmelden. Schreib uns, wenn wir dein Konto und deine Daten löschen sollen.',
  },
  {
    title: 'Deine Rechte',
    text:
      'Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung, ' +
      'auf Datenübertragbarkeit und auf Widerspruch. Außerdem kannst du dich bei einer ' +
      'Datenschutz-Aufsichtsbehörde beschweren.',
  },
];

/** Privacy policy (Figma `19. Datenschutz`, mobile `156062:17306`). */
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {
  readonly sections = PRIVACY_SECTIONS;
}
