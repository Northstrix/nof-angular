import { Component, Input, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { LanguageService } from './language.service';
import chroma from 'chroma-js';

@Component({
  selector: 'app-color-card',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="group min-w-[300px] relative flex flex-col gap-3 pb-3 pt-4 px-4 bg-black border border-[#1a1a1a] rounded-[24px] hover:border-[#262626] transition-colors" [class.rtl]="rtl">
    <div class="h-20 w-full rounded-md border border-white/5 relative overflow-hidden" [style.background]="hex">
      <span *ngIf="label" 
            class="absolute top-2 bg-black/40 backdrop-blur text-[10px] px-2 py-0.5 rounded text-white"
            [class.left-2]="!rtl" [class.right-2]="rtl" 
            [class.text-right]="rtl" [class.text-left]="!rtl">
        {{label}}
      </span>
    </div>
    <div class="flex justify-between items-center" [class.flex-row-reverse]="rtl">
      <code class="text-xs font-mono text-gray-300 cursor-pointer select-all" dir="ltr"
            [class.text-right]="rtl" 
            [class.text-left]="!rtl">
        {{hex.toUpperCase()}}
      </code>
    </div>
    <div class="flex items-center gap-3 mt-auto" [class.flex-row-reverse]="rtl">
      <div class="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 font-bold text-white select-none"
        [style.background]="hex">
        {{ rtl ? 'ל' : 'A' }}
      </div>
      <div class="flex flex-col w-full" [class.items-end]="rtl" [class.items-start]="!rtl" [class.text-right]="rtl" [class.text-left]="!rtl">
        <span class="label-name">{{ ls.t('contrastRatio') }}</span>
        <div class="flex items-center w-full" 
            [class.flex-row-reverse]="rtl" 
            [class.justify-between]="true">
          <span class="label-value">{{ getContrast() }}</span>
          <div class="flex gap-1 mt-[-4px]">
            <span class="badge" [ngClass]="contrastVal >= 4.5 ? 'true-badge' : 'false-badge'">AA</span>
            <span class="badge" [ngClass]="contrastVal >= 7 ? 'true-badge' : 'false-badge'">AAA</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .badge {
      font-size: 9px;
      padding: 1px 6px;
      border-radius: 99px;
      border: 1px solid;
      display: inline-flex;
      align-items: center;
      height: 18px;
      user-select: none;
      gap: 3px;
    }
    .true-badge {
      background: #002030;
      color: #00A2FA;
      border-color: #00334d;
    }
    .false-badge {
      background: transparent;
      color: #aaa;
      border-color: #242424;
    }
    .rtl {
      direction: rtl;
    }
    .rtl .left-2 {
      left: auto !important;
      right: 0.5rem !important;
    }
    .rtl .right-2 {
      left: 0.5rem !important;
      right: auto !important;
    }
    .rtl .flex {
      flex-direction: row-reverse;
    }
    .label-name {
      color: #aaa;
      font-size: 0.75rem;
    }
    .label-value {
      font-family: monospace;
      font-size: 0.875rem;
    }
  `]
})
export class ColorCardComponent {
  @Input() hex: string = '#000000';
  @Input() label?: string;
  contrastVal = 0;
  readonly rtl: boolean;
  readonly ls = inject(LanguageService);

  constructor() {
    const dir = inject(DOCUMENT).documentElement.getAttribute('dir') || 'ltr';
    this.rtl = dir === 'rtl';
  }

  getContrast() {
    try {
      this.contrastVal = chroma.contrast(this.hex, '#000');
      return this.contrastVal.toFixed(2);
    } catch {
      this.contrastVal = 0;
      return '0.00';
    }
  }

}
