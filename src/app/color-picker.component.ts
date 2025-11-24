import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from './language.service';
import chroma from 'chroma-js';
import gsap from 'gsap';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="color-card bg-black border border-[#1a1a1a] rounded-[24px] hover:border-[#262626] transition-colors" [ngClass]="{ ltr: ls.dir() === 'ltr', rtl: ls.dir() === 'rtl' }">
    <div class="color-area-wrapper" [ngClass]="{ rtl: ls.dir() === 'rtl' }">
      <div #colorArea (mousedown)="startDrag($event)" class="color-area" [style.background]="colorAreaBackground">
        <div #indicator class="active-indicator"></div>
      </div>
    </div>
    <input type="range" class="hue-slider" min="0" max="360"
      [value]="hue()"
      (input)="onHueChange($any($event).target.value)"
      [style.background]="
        ls.dir() === 'rtl' 
          ? 'linear-gradient(to left, red, yellow, lime, cyan, blue, magenta, red)'
          : 'linear-gradient(to left, red, magenta, blue, cyan, lime, yellow, red)'
      "
    />
    <div class="floating-label-input-wrapper" style="direction: ltr;">
      <input type="text" class="floating-label-input" [(ngModel)]="inputValue" (ngModelChange)="onHexInputChange($event)" placeholder=" " autocomplete="off" maxlength="7" [style.textAlign]="ls.dir() === 'rtl' ? 'right' : 'left'" />
      <label [class.rtl]="ls.dir() === 'rtl'">HEX</label>
    </div>

    <ng-container *ngIf="ls.dir() === 'rtl'; else ltrBlock">
      <!-- RTL Block -->
      <div
        class="flex items-center gap-3 mt-auto"
        aria-label="Contrast ratio"
        dir="ltr"
      >
        <div
          class="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 font-bold text-white select-none"
          [style.background]="getCurrentColor()"
        >
          ל
        </div>

        <div class="flex flex-col w-full items-end text-right">
          <div class="w-full text-right" dir="rtl">
            <span class="label-name block w-full">{{ ls.t('contrastRatio') }}</span>
            <span class="label-value block w-full">{{ getContrast() }}</span>
          </div>

          <div class="flex gap-1 justify-end mt-[-4px]" dir="rtl">
            <span class="badge" [ngClass]="contrastVal >= 7 ? 'true-badge' : 'false-badge'">AAA</span>
            <span class="badge" [ngClass]="contrastVal >= 4.5 ? 'true-badge' : 'false-badge'">AA</span>
          </div>
        </div>
      </div>
    </ng-container>

    <ng-template #ltrBlock>
      <!-- LTR Block -->
      <div class="flex items-center gap-3 mt-auto" [class.flex-row-reverse]="isRTL" aria-label="Contrast ratio">
        <div class="w-8 h-8 flex items-center justify-center rounded-md border border-white/10 font-bold text-white select-none" [style.background]="getCurrentColor()">
          {{ isRTL ? 'ל' : 'A' }}
        </div>
        <div class="flex flex-col w-full" [class.items-end]="rtl" [class.items-start]="!rtl" [class.text-right]="rtl" [class.text-left]="!rtl">
          <span class="label-name">{{ ls.t('contrastRatio') }}</span>
          <div class="flex items-center w-full" [class.flex-row-reverse]="rtl" [class.justify-between]="true">
            <span class="label-value">{{ getContrast() }}</span>
            <div class="flex gap-1 justify-end mt-[-4px]" dir="ltr">
              <span class="badge" [ngClass]="contrastVal >= 4.5 ? 'true-badge' : 'false-badge'">AA</span>
              <span class="badge" [ngClass]="contrastVal >= 7 ? 'true-badge' : 'false-badge'">AAA</span>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
        
  </div>
  `,
  styles: [
    `
    .color-card {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 1rem 1rem calc(1rem - 4px);
      gap: 1rem;
      width: 100%;
      direction: ltr;
    }
    .color-card.rtl {
      direction: rtl;
    }
    .color-area-wrapper {
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid var(--border, #333);
    }
    .color-area {
      position: relative;
      width: 100%;
      aspect-ratio: 2 / 1;
      cursor: crosshair;
      background-blend-mode: multiply;
      touch-action: none;
      user-select: none;
    }
    .active-indicator {
      position: absolute;
      width: 10px;
      height: 10px;
      border: 2px solid white;
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
      transform: translate(-50%, -50%);
    }
    .hue-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 10px;
      border: 1px solid var(--border, #333);
      border-radius: 12px;
      cursor: pointer;
      background-size: 100% 100%;
      margin-top: 4px;
    }
    .hue-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      border: 1px solid #000;
      cursor: pointer;
    }
    .floating-label-input-wrapper {
      position: relative;
      width: 120px;
      margin-top: 8px;
    }
    .floating-label-input {
      background: #090909;
      border: 1px solid #333;
      color: white;
      border-radius: 8px;
      padding: 0.625rem 1rem 0.625rem 1rem;
      width: 100%;
      font-family: monospace;
      font-size: 1rem;
      outline: none;
      direction: ltr;
      text-align: left;
    }
    .floating-label-input::placeholder {
      color: transparent;
    }
    .floating-label-input:focus {
      border-color: #fff;
    }
    label {
      position: absolute;
      pointer-events: none;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #858585;
      font-size: 0.8rem;
      transition: all 0.2s ease;
      background: #000;
      padding: 0 4px;
      border-radius: 4px;
    }
    .floating-label-input:focus + label,
    .floating-label-input:not(:placeholder-shown) + label {
      top: 0.25rem;
      font-size: 0.65rem;
      color: #00a2fa;
      transform: translateY(calc(-100% + 5px));
    }
    label.rtl {
      left: auto;
      right: 12px;
    }
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
      color: #00a2fa;
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
  `
  ],
})
export class ColorPickerComponent implements AfterViewInit {
  @Input() color: string = '#00A2FA';
  @Output() colorChange = new EventEmitter<string>();
  @ViewChild('colorArea') colorArea!: ElementRef<HTMLDivElement>;
  @ViewChild('indicator') indicator!: ElementRef<HTMLDivElement>;
  readonly ls = inject(LanguageService);
  readonly rtl: boolean;
  hue = signal(200);
  sat = 100;
  bright = 100;
  inputValue = this.color;
  contrastVal = 0;
  isDragging = false;

  constructor() {
    const dir = inject(DOCUMENT).documentElement.getAttribute('dir') || 'ltr';
    this.rtl = dir === 'rtl';
    effect(() => {
      if (chroma.valid(this.color)) {
        const hsv = chroma(this.color).hsv();
        let h = isNaN(hsv[0]) ? this.hue() : hsv[0];
        if (h >= 360) h = 359.999;
        this.hue.set(h);
        this.sat = hsv[1] * 100;
        this.bright = hsv[2] * 100;
        this.inputValue = this.color.toUpperCase();
        this.updateUI();
      }
    }, { allowSignalWrites: true });
  }

  get isRTL() {
    return this.rtl;
  }

  get colorAreaBackground() {
    const direction = this.isRTL ? 'to left' : 'to right';
    return `linear-gradient(${direction}, white, hsl(${this.hue()}, 100%, 50%)), linear-gradient(to top, black, transparent)`;
  }

  updateUI() {
    if (!this.colorArea) return;
    this.colorArea.nativeElement.style.setProperty('--hue', String(this.hue()));
    const satForPosition = this.isRTL ? 100 - this.sat : this.sat;
    const c = chroma.hsv(this.hue(), this.sat / 100, this.bright / 100);
    this.contrastVal = chroma.contrast(c, '#000');
    gsap.to(this.indicator.nativeElement, {
      left: `${satForPosition}%`,
      top: `${100 - this.bright}%`,
      duration: 0.1,
      overwrite: true,
    });
  }

  onHueChange(val: number) {
    let hueVal = Number(val);
    if (hueVal >= 360) hueVal = 359.999;
    if (hueVal < 0) hueVal = 0;
    this.hue.set(hueVal);
    this.emitColor();
  }

  onHexInputChange(val: string) {
    const upperVal = val.toUpperCase();
    this.inputValue = upperVal;
    if (val.trim() === '' || !chroma.valid(upperVal)) {
      this.hue.set(0);
      this.sat = 0;
      this.bright = 0;
      this.colorChange.emit('#000000');
      this.updateUI();
      return;
    }
    const c = chroma(upperVal);
    let h = c.hsv()[0];
    if (isNaN(h) || h >= 360) h = 360;
    if (h < 0) h = 0;
    this.hue.set(h);
    this.sat = c.hsv()[1] * 100;
    this.bright = c.hsv()[2] * 100;
    this.colorChange.emit(c.hex().toUpperCase());
    this.updateUI();
  }

  startDrag(e: MouseEvent) {
    e.preventDefault();
    this.isDragging = true;
    this.handleMove(e);
  }

  handleMove(e: MouseEvent) {
    if (!this.isDragging) return;
    const rect = this.colorArea.nativeElement.getBoundingClientRect();
    let x = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    let y = Math.max(0, Math.min(1 - (e.clientY - rect.top) / rect.height, 1));
    const satForValue = this.isRTL ? 100 - x * 100 : x * 100;
    this.sat = satForValue;
    this.bright = y * 100;
    this.emitColor();
  }

  addGlobalListeners() {
    window.addEventListener('mouseup', () => (this.isDragging = false));
    window.addEventListener('mousemove', (e) => this.handleMove(e));
  }

  emitColor() {
    const c = chroma.hsv(this.hue(), this.sat / 100, this.bright / 100).hex().toUpperCase();
    this.inputValue = c;
    this.colorChange.emit(c);
    this.updateUI();
  }

  getCurrentColor() {
    if (!chroma.valid(this.inputValue)) {
      return '#000000';
    }
    return this.inputValue;
  }

  getContrast() {
    return this.contrastVal.toFixed(2);
  }

  ngAfterViewInit() {
    this.updateUI();
    this.addGlobalListeners();
  }
}
