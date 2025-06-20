declare module 'aos' {
  export interface AosOptions {
    duration?: number;
    once?: boolean;
    delay?: number;
    offset?: number;
    easing?: string;
    mirror?: boolean;
  }

  export interface Aos {
    init(options?: AosOptions): void;
    refresh(): void;
    refreshHard(): void;
  }

  const aos: Aos;
  export default aos;
} 