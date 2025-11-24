import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import chroma from 'chroma-js';
import { LanguageService, LangCode } from './language.service';
import { ColorPickerComponent } from './color-picker.component';
import { ColorCardComponent } from './color-card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ColorPickerComponent,
    ColorCardComponent
  ],
  template: `
    <!-- Navbar -->
    <div class="fixed top-0 w-full z-40 flex justify-center pt-4 px-4" [dir]="ls.dir()">
      <div class="glass w-full max-w-[1314px] rounded-2xl flex items-center justify-between px-6 py-2 relative">
        <a 
          href="/"
          class="flex items-center gap-2 font-bold text-lg z-20 transition-colors hover:text-[#00a2fa]"
          title="{{ ls.t('appName') }}"
        >
          <img 
            src="assets/logo.png" 
            class="w-8 h-8 rounded-md select-none pointer-events-none" 
            draggable="false"
            (error)="$any($event.target).style.display='none'"
            alt="App logo"
          />
          <span>{{ ls.t('appName') }}</span>
        </a>
        <div class="flex gap-2 z-20 items-center">
          <button (click)="toggleLang()" class="p-2 hover:bg-white/10 rounded-md transition">
            <lucide-icon name="globe" [size]="20"></lucide-icon>
          </button>
          <a 
            href="https://github.com/Northstrix/nof-angular" 
            target="_blank" 
            rel="noopener" 
            class="p-2 hover:bg-white/10 rounded-md transition"
          >
            <lucide-icon name="github" [size]="20"></lucide-icon>
          </a>
        </div>
      </div>
    </div>
    <!-- Language Modal -->
    <div
      *ngIf="showLangModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      (click)="showLangModal = false"
    >
      <div
        class="glass flex flex-col gap-1 min-w-[200px] text-center"
        style="border-radius: 24px; padding: 16px;"
        (click)="$event.stopPropagation()"
      >
        <h2 class="font-bold text-lg mb-4">{{ ls.t('language') }}</h2>
        <button
          *ngFor="let lang of languages"
          (click)="setLang(lang)"
          class="w-full rounded transition-colors flex items-center justify-center px-3 py-1.5 mb-1 text-[14px] leading-[21px]"
          [ngClass]="{
            'bg-[#00a2fa] text-black font-semibold': ls.currentLang() === lang,
            'text-gray-300 hover:bg-white/10 hover:text-gray-300': ls.currentLang() !== lang
          }"
          style="border-radius: 8px;"
        >
          {{ lang === 'en' ? 'English' : lang === 'he' ? 'עברית' : lang === 'it' ? 'Italiano' : lang === 'es' ? 'Español' : 'Português' }}
        </button>
      </div>
    </div>
    <main class="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-12" [dir]="ls.dir()">
      <div class="glass p-6 bg-black border border-[#1a1a1a] rounded-[48px] hover:border-[#262626] transition-colors shadow-2xl flex flex-col gap-8">
        <div class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div class="w-full">
              <label class="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3 block">{{ ls.t('baseColor') }}</label>
              <app-color-picker [(color)]="baseColor"></app-color-picker>
            </div>
            <div>
            <label class="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3 block">{{ ls.t('mode') }}</label>
            <div
              class="glass-panel bg-black border border-[#1a1a1a] rounded-[24px] hover:border-[#262626] transition-colors overflow-y-auto"
              [style.textAlign]="ls.dir() === 'rtl' ? 'right' : 'left'"
              style="padding: 16px;"
            >
              <button
                *ngFor="let opt of harmonyModes"
                (click)="harmonyMode = opt"
                [style.backgroundColor]="opt === harmonyMode ? '#00a2fa' : null"
                [ngClass]="opt === harmonyMode
                  ? 'text-black font-semibold'
                  : 'text-gray-300 hover:bg-white/10 hover:text-gray-300'"
                class="w-full rounded transition-colors flex items-center justify-center px-3 py-1.5 mb-2 text-[14px] leading-[20px]"
                [style.borderRadius]="'8px'"
                [style.direction]="ls.dir() === 'rtl' ? 'rtl' : 'ltr'"
                style="justify-content: flex-start;"
              >
                {{ ls.t(opt) }}
              </button>
            </div>
            </div>
          </div>
          <div>
            <h3 class="text-sm text-gray-400 mb-4 uppercase tracking-wider">{{ ls.t('output') }}</h3>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
              <app-color-card *ngFor="let c of getHarmonies()" [hex]="c"></app-color-card>
            </div>
          </div>
        </div>
      </div>
      <div class="glass p-6 bg-black border border-[#1a1a1a] rounded-[48px] hover:border-[#262626] transition-colors shadow-2xl flex flex-col gap-8">
        <h3 class="font-bold text-lg">{{ ls.t('creditInfoTitle') }}</h3>
        <span class="mt-[-24px] mb-[-20px]" style="color:#aaa;">{{ ls.t('creditDescription') }}</span>
        <div class="text-gray-400 space-y-1 mb-4" style="direction:ltr; text-align: {{ ls.dir() === 'rtl' ? 'right' : 'left' }}">
          <a href="https://21st.dev/community/components/uplusion23/color-picker/color-picker-with-swatches-and-onchange" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Color Picker</a> by 
          <a href="https://21st.dev/community/uplusion23" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Trevor McIntire</a> <br> 
          
          <a href="https://vue-color-wheel.vercel.app/" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">vue-color-wheel</a> by 
          <a href="https://github.com/xiaoluoboding" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Robert Shaw</a> <br> 
          
          <a href="https://ui.aceternity.com/components/resizable-navbar" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Resizable Navbar</a> by 
          <a href="https://ui.aceternity.com/" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Aceternity UI</a> <br> 
          
          <a href="https://21st.dev/easemize/limelight-nav/default" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Limelight Nav</a> by 
          <a href="https://21st.dev/easemize" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">EaseMize UI</a> <br> 
          
          <a href="https://www.npmjs.com/package/gsap" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">GSAP</a> <br> 
          
          <a href="https://nextjs.org" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Next.js</a> <br> 

          <a href="https://angular.dev" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Angular</a> <br> 

          <a href="https://www.perplexity.ai/" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Perplexity</a> <br> 

          <a href="https://firebase.studio" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Firebase Studio</a> <br> 

          <a href="https://aistudio.google.com" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Google AI Studio</a> <br> 

          <a href="https://www.npmjs.com/package/chroma-js" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Chroma.js</a> <br> 

          <a href="https://www.npmjs.com/package/lucide-angular" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Lucide Angular</a> <br> 
          
          <a href="https://tailwindcss.com/" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Tailwind CSS</a> <br> 

          <a href="https://21st.dev/Edil-ozi/custom-checkbox/default" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Custom Checkbox</a> by 
          <a href="https://21st.dev/Edil-ozi" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Edil Ozi</a> <br> 
          
          <a href="https://codepen.io/ash_creator/pen/zYaPZLB" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">すりガラスなプロフィールカード</a> by 
          <a href="https://codepen.io/ash_creator" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">あしざわ - Webクリエイター</a> <br> 
          
          <a href="https://codepen.io/Mahe76/pen/qBQgXyK" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Input Floating Label animation</a> by 
          <a href="https://codepen.io/Mahe76" target="_blank" class="text-accent hover:underline ml-1" style="color:#00a2fa;">Elpeeda</a> <br>
        </div>
        <div style="display: flex; justify-content: center;">
          <a
            href="https://namer-ui.vercel.app/"
            class="inline-flex flex-col select-none bg-[#0e0e0e] border border-[#1a1a1a] rounded-[24px] hover:bg-[#121212] hover:border-[#262626] transition-colors"
            style="padding:16px 24px 24px 24px; max-width:max-content; direction:{{ ls.dir() === 'rtl' ? 'rtl' : 'ltr' }}; text-align:{{ ls.dir() === 'rtl' ? 'right' : 'left' }};">
            <span class="text-gray-400 text-xs mb-2" style="user-select:none;">
              {{ ls.t('poweredBy') }}
            </span>
            <div class="inline-flex items-center gap-3" style="justify-content:{{ ls.dir() === 'rtl' ? 'flex-end' : 'flex-start' }};">
              <img src="assets/namer-ui-logo.png" alt="{{ ls.t('namerUiName') }}" width="32" height="32" style="object-fit:contain; display:inline-block;">
              <span class="font-bold text-base text-white select-none" dir="ltr">{{ ls.t('namerUi') }}</span>
            </div>
          </a>
        </div>
        <div class="text-gray-400 flex justify-center items-center text-center flex-wrap w-full" [dir]="ls.dir()" style="white-space: normal; word-break: break-word;">
          <span style="white-space: pre;">{{ ls.t('madeBy') }} </span>
          <a href="https://maxim-bortnikov.netlify.app/" target="_blank" style="color:#00a2fa;" class="hover:underline">
            {{ ls.t('maximBortnikov') }}
          </a>
        </div>
      </div>
    </main>
  `
})
export class AppComponent implements OnInit {
  ls = inject(LanguageService);
  languages: LangCode[] = ['en', 'he', 'it', 'es', 'pt'];

  showLangModal = false;

  baseColor = '#00A2FA';
  harmonyMode = 'analogous';
  harmonyModes = ['analogous', 'triad', 'complementary', 'splitComp', 'square', 'tetradic', 'monochromatic'];

  mix1 = '#FA00A2';
  mix2 = '#2CADF6';
  mixMode: any = 'rgb';
  mixStepsMode = true;
  mixSteps = 5;

  brightBase = '#FA5800';
  brightMode = 'lighten';

  creditsHtml = `
    <a href="https://angular.io" class="text-accent hover:underline">Angular</a>,
    </br>
    <a href="https://tailwindcss.com" class="text-accent hover:underline">Tailwind</a>,
    <a href="https://greensock.com" class="text-accent hover:underline">GSAP</a>,
    <a href="https://lucide.dev" class="text-accent hover:underline">Lucide</a>.
    Original concept adapted for Angular.
  `;

  ngOnInit() { /* No loader logic needed */ }

  toggleLang() { this.showLangModal = !this.showLangModal; }
  setLang(code: LangCode) { this.ls.setLang(code); this.showLangModal = false; }

  getHarmonies(): string[] {
    if (!chroma.valid(this.baseColor)) return [];
    const h = chroma(this.baseColor).get('hsl.h');
    const s = chroma(this.baseColor).get('hsl.s');
    const l = chroma(this.baseColor).get('hsl.l');
    const setHue = (deg: number) => chroma.hsl((h + deg) % 360, s, l).hex();

    switch (this.harmonyMode) {
      case 'analogous': return [setHue(-30), this.baseColor, setHue(30)];
      case 'triad': return [this.baseColor, setHue(120), setHue(240)];
      case 'complementary': return [this.baseColor, setHue(180)];
      case 'splitComp': return [this.baseColor, setHue(150), setHue(210)];
      case 'square': return [this.baseColor, setHue(90), setHue(180), setHue(270)];
      case 'tetradic': return [this.baseColor, setHue(60), setHue(180), setHue(240)];
      case 'monochromatic': return chroma.scale([chroma(this.baseColor).darken(2), this.baseColor, chroma(this.baseColor).brighten(2)]).colors(5);
      default: return [this.baseColor];
    }
  }
}
