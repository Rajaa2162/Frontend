import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.html',
  styleUrls: ['./faq.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FaqComponent {
  openAnswers: { [key: string]: boolean } = {};

  toggleAnswer(faqId: string): void {
    this.openAnswers[faqId] = !this.openAnswers[faqId];
  }

  isAnswerOpen(faqId: string): boolean {
    return !!this.openAnswers[faqId];
  }
} 