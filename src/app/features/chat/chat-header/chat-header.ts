import { Component } from '@angular/core';

/**
 * Header of a chat view (Figma `210:1110`, 96 px high, shadow "header"; mobile `678:13870`,
 * 60 px). The content (channel name and members, or the person) is projected.
 */
@Component({
  selector: 'app-chat-header',
  template: '<ng-content />',
  styleUrl: './chat-header.scss',
})
export class ChatHeader {}
