import { Injectable, signal, computed } from '@angular/core';

export type LangCode = 'en' | 'he' | 'it' | 'es' | 'pt';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  currentLang = signal<LangCode>('en');
  dir = computed(() => (this.currentLang() === 'he' ? 'rtl' : 'ltr'));

  translations: Record<LangCode, any> = {
    en: {
      appName: "Nof Angular",
      baseColor: "Base Color",
      mode: "Mode",
      output: "Output",
      analogous: "Analogous",
      triad: "Triad",
      complementary: "Complementary",
      splitComp: "Split Complementary",
      square: "Square",
      tetradic: "Tetradic",
      monochromatic: "Monochromatic",
      firstColor: "First Color",
      secondColor: "Second Color",
      creditInfoTitle: "Credit & Info",
      creditDescription: "The existence of this project wouldn't've been possible without the following:",
      poweredBy: "Powered by",
      namerUi: "Namer UI",
      contrastRatio: "Contrast Ratio:",
      language: "Language",
      madeBy: "Made by",
      maximBortnikov: "Maxim Bortnikov",
    },
    he: {
      appName: "נוף אנגולר",
      baseColor: "צבע בסיס",
      mode: "מצב",
      output: "פלט",
      analogous: "אנלוגי",
      triad: "טריאדה",
      complementary: "משלים",
      splitComp: "משלים מפוצל",
      square: "ריבועי",
      tetradic: "טטראדי",
      monochromatic: "מונוכרומטי",
      firstColor: "צבע ראשון",
      secondColor: "צבע שני",
      creditInfoTitle: "קרדיט ומידע",
      creditDescription: "הפרויקט הזה לא היה אפשרי בלעדי התרומות הבאות:",
      poweredBy: "מופעל על ידי",
      namerUi: "UI נמר",
      contrastRatio: "יחס ניגודיות:",
      language: "שפה",
      madeBy: "נוצר על ידי",
      maximBortnikov: "מקסים בורטניקוב",
    },
    it: {
      appName: "Nof Angular",
      baseColor: "Colore base",
      mode: "Modalità",
      output: "Output",
      analogous: "Analoghi",
      triad: "Triade",
      complementary: "Complementare",
      splitComp: "Complementare diviso",
      square: "Quadrato",
      tetradic: "Tetradico",
      monochromatic: "Monocromatico",
      firstColor: "Primo colore",
      secondColor: "Secondo colore",
      creditInfoTitle: "Credito e Info",
      creditDescription: "L'esistenza di questo progetto non sarebbe stata possibile senza i seguenti:",
      poweredBy: "Realizzato con",
      namerUi: "Namer UI",
      contrastRatio: "Rapporto di contrasto:",
      language: "Lingua",
      madeBy: "Realizzato da",
      maximBortnikov: "Maxim Bortnikov",
    },
    es: {
      appName: "Nof Angular",
      baseColor: "Color base",
      mode: "Modo",
      output: "Salida",
      analogous: "Análogas",
      triad: "Tríada",
      complementary: "Complementario",
      splitComp: "Complementario dividido",
      square: "Cuadrado",
      tetradic: "Tetrádico",
      monochromatic: "Monocromático",
      firstColor: "Primer color",
      secondColor: "Segundo color",
      creditInfoTitle: "Crédito e Información",
      creditDescription: "La existencia de este proyecto no habría sido posible sin los siguientes:",
      poweredBy: "Desarrollado por",
      namerUi: "Namer UI",
      contrastRatio: "Relación de contraste:",
      language: "Idioma",
      madeBy: "Hecho por",
      maximBortnikov: "Maxim Bortnikov",
    },
    pt: {
      appName: "Nof Angular",
      baseColor: "Cor base",
      mode: "Modo",
      output: "Saída",
      analogous: "Análogas",
      triad: "Tríade",
      complementary: "Complementar",
      splitComp: "Complementar dividido",
      square: "Quadrado",
      tetradic: "Tetrádico",
      monochromatic: "Monocromático",
      firstColor: "Primeira cor",
      secondColor: "Segunda cor",
      creditInfoTitle: "Crédito e Informação",
      creditDescription: "A existência deste projeto não teria sido possível sem os seguintes:",
      poweredBy: "Desenvolvido por",
      namerUi: "Namer UI",
      contrastRatio: "Relação de contraste:",
      language: "Idioma",
      madeBy: "Feito por",
      maximBortnikov: "Maxim Bortnikov",
    }
  };


  t(key: string): string {
    return this.translations[this.currentLang()][key] || key;
  }

  setLang(code: LangCode) {
    this.currentLang.set(code);
  }
}