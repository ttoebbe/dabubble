import { Component } from '@angular/core';

/** One heading with its paragraph in the privacy policy. */
interface PrivacySection {
  readonly title: string;
  readonly text: string;
}

const PLACEHOLDER_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque odio felis, iaculis ut massa eget, ornare lacinia urna. In dignissim justo eu velit sagittis, in scelerisque nulla convallis. Vestibulum eros lorem, sollicitudin eget eros non, varius aliquam mauris. Sed turpis ipsum, condimentum quis nulla at, lobortis facilisis ipsum. Nunc erat justo, hendrerit vel enim vitae, feugiat mattis dui. In auctor dignissim luctus. Mauris ornare ipsum at ultrices eleifend. Praesent tempus congue magna. Quisque libero erat, pharetra a neque et, imperdiet semper justo.';

/** Sections exactly as in Figma; the team replaces them with the real policy before submission. */
const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  { title: 'Subtitle', text: PLACEHOLDER_TEXT },
  { title: 'Subtitle', text: PLACEHOLDER_TEXT },
  { title: 'Subtitle', text: `${PLACEHOLDER_TEXT} ${PLACEHOLDER_TEXT}` },
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
