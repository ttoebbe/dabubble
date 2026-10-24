import { Component } from '@angular/core';

/** One heading with its paragraph in the privacy policy. */
interface PrivacySection {
  readonly title: string;
  readonly text: string;
}

/**
 * Draft of the privacy policy for what DABubble actually processes (decision Thomas 22.10.2026),
 * extended with the parts of the Join policy (e-recht24 template) that apply here. Not legal
 * advice: the team checks it before submission; names and address come from the imprint.
 */
const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  {
    title: 'Allgemeine Hinweise',
    text:
      'Hier erfährst du, was mit deinen personenbezogenen Daten passiert, wenn du DABubble ' +
      'nutzt. Personenbezogen sind alle Daten, mit denen man dich persönlich erkennen kann, zum ' +
      'Beispiel dein Name oder deine E-Mail-Adresse. Wir behandeln deine Daten vertraulich und ' +
      'nach den gesetzlichen Datenschutzvorschriften.',
  },
  {
    title: 'Verantwortlich',
    text:
      'Verantwortlich für die Verarbeitung deiner Daten in DABubble sind die im Impressum ' +
      'genannten Personen. Verantwortlich ist, wer allein oder gemeinsam mit anderen über Zweck ' +
      'und Mittel der Verarbeitung entscheidet. Im Impressum findest du auch die ' +
      'E-Mail-Adressen für alle Fragen zum Datenschutz.',
  },
  {
    title: 'Worum es geht',
    text:
      'DABubble ist ein Lernprojekt der Developer Akademie: ein Team-Messenger mit Channels und ' +
      'Direktnachrichten. Wir verarbeiten nur die Daten, die für die Nutzung der App nötig ' +
      'sind. Es gibt keine Werbung, keine Analyse-Tools und kein Tracking.',
  },
  {
    title: 'Konto und Profil',
    text:
      'Für ein Konto speichern wir deinen Namen, deine E-Mail-Adresse, deinen gewählten Avatar, ' +
      'deinen Online-Status (aktiv oder abwesend) und den Zeitpunkt deiner letzten Aktivität. ' +
      'Dein Passwort verwaltet Firebase Authentication, wir sehen es nicht. Name, Avatar, ' +
      'E-Mail-Adresse und Online-Status sind für alle angemeldeten Personen in DABubble ' +
      'sichtbar. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der App).',
  },
  {
    title: 'Gäste-Login',
    text:
      'Beim Gäste-Login legt Firebase ein anonymes Konto mit dem Namen „Gast“ an. Wenn du dich ' +
      'abmeldest, löschen wir dieses Konto und sein Profil. Schließt du nur den Tab, löschen ' +
      'wir das Profil nach 24 Stunden ohne Aktivität; das leere anonyme Konto bleibt bei ' +
      'Firebase bestehen. Deine Nachrichten bleiben erhalten und erscheinen danach unter ' +
      '„Gast“.',
  },
  {
    title: 'Anmeldung mit Google',
    text:
      'Die Anmeldung mit Google ist freiwillig. Meldest du dich damit an, übermittelt Google ' +
      'deinen Namen, deine E-Mail-Adresse, eine Konto-Kennung und den Link zu deinem ' +
      'Google-Profilbild an Firebase Authentication. In DABubble zeigen wir statt des ' +
      'Google-Bilds einen Avatar der App. Anbieter ist die Google Ireland Limited, Gordon ' +
      'House, Barrow Street, Dublin 4, Irland. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO; ' +
      'zusätzlich gilt die Datenschutzerklärung von Google.',
  },
  {
    title: 'Channels und Nachrichten',
    text:
      'Channels mit Name, Beschreibung und Mitgliedern sowie Nachrichten, Antworten in Threads, ' +
      'Direktnachrichten und Reaktionen werden gespeichert, damit die Beteiligten sie sehen und ' +
      'durchsuchen können. Nachrichten in einem Channel sehen alle seine Mitglieder, ' +
      'Direktnachrichten nur die beiden Beteiligten. Neue Konten treten automatisch dem Channel ' +
      '„Entwicklerteam“ bei; du kannst ihn jederzeit verlassen. Rechtsgrundlage ist Art. 6 Abs. ' +
      '1 lit. b DSGVO.',
  },
  {
    title: 'Firebase',
    text:
      'Konten und Inhalte liegen bei Google Firebase (Firebase Authentication und Cloud ' +
      'Firestore) der Google Ireland Limited, die sie in unserem Auftrag verarbeitet. Die ' +
      'Datenbank steht in Frankfurt am Main. Eine Übermittlung in die USA ist nicht ' +
      'ausgeschlossen; Google ist dafür nach dem EU-US Data Privacy Framework zertifiziert.',
  },
  {
    title: 'Speicherung im Browser',
    text:
      'Damit du angemeldet bleibst, speichert Firebase deinen Anmeldestatus im Speicher deines ' +
      'Browsers. Außerdem merkt sich die App dort die Emojis, die du zuletzt benutzt hast. ' +
      'Beides ist für die von dir gewünschten Funktionen nötig (§ 25 Abs. 2 Nr. 2 TDDDG). Wir ' +
      'setzen keine Cookies zu Werbe- oder Analysezwecken. Du kannst den Speicher jederzeit in ' +
      'deinem Browser löschen; danach musst du dich neu anmelden.',
  },
  {
    title: 'Hosting und Server-Logdateien',
    text:
      'Die Website liegt auf einem Webspace der Developer Akademie. Beim Aufruf speichert der ' +
      'Server automatisch Zugriffsdaten in Logdateien: Browsertyp und -version, Betriebssystem, ' +
      'Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Anfrage und IP-Adresse. ' +
      'Wir führen diese Daten nicht mit anderen Daten zusammen. Rechtsgrundlage ist unser ' +
      'berechtigtes Interesse an einem sicheren und fehlerfreien Betrieb (Art. 6 Abs. 1 lit. f ' +
      'DSGVO).',
  },
  {
    title: 'SSL- bzw. TLS-Verschlüsselung',
    text:
      'Die Seite nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Du erkennst ' +
      'sie an „https://“ in der Adresszeile und am Schloss-Symbol deines Browsers. Bei einer ' +
      'verschlüsselten Verbindung können Dritte die Daten, die du an uns übermittelst, nicht ' +
      'mitlesen. Ganz ohne Sicherheitslücken ist eine Übertragung im Internet trotzdem nie.',
  },
  {
    title: 'Kontakt per E-Mail',
    text:
      'Schreibst du uns eine E-Mail, speichern wir deine Anfrage mit deinen Angaben, um sie zu ' +
      'bearbeiten und für Rückfragen. Wir geben sie nicht ohne deine Einwilligung weiter. ' +
      'Rechtsgrundlage ist unser berechtigtes Interesse an der Bearbeitung deiner Anfrage (Art. ' +
      '6 Abs. 1 lit. f DSGVO). Wir löschen die Anfrage, sobald sie erledigt ist.',
  },
  {
    title: 'Empfänger',
    text:
      'Deine Daten erhalten nur die Dienste, die wir für den Betrieb brauchen: Google Firebase ' +
      'und der Webspace der Developer Akademie. Anderen geben wir sie nur weiter, wenn ein ' +
      'Gesetz uns dazu verpflichtet.',
  },
  {
    title: 'Speicherdauer',
    text:
      'Wir speichern deine Daten, solange dein Konto besteht. Gastprofile löschen wir beim ' +
      'Abmelden oder nach 24 Stunden ohne Aktivität. Schreib uns, wenn wir dein Konto und deine ' +
      'Daten löschen sollen; dann löschen wir sie, sofern uns kein Gesetz zur Aufbewahrung ' +
      'verpflichtet.',
  },
  {
    title: 'Deine Rechte',
    text:
      'Du hast jederzeit das Recht, unentgeltlich Auskunft über deine gespeicherten Daten, ihre ' +
      'Herkunft, ihre Empfänger und den Zweck der Verarbeitung zu bekommen. Du kannst ' +
      'Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit ' +
      'verlangen. Beruht eine Verarbeitung auf unserem berechtigten Interesse, kannst du ihr ' +
      'widersprechen. Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde ' +
      'beschweren.',
  },
  {
    title: 'Widerspruch gegen Werbe-Mails',
    text:
      'Wir widersprechen der Nutzung unserer im Impressum veröffentlichten Kontaktdaten für ' +
      'nicht angeforderte Werbung und Informationsmaterialien. Bei unerwünschter Werbung, etwa ' +
      'Spam-Mails, behalten wir uns rechtliche Schritte vor.',
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
