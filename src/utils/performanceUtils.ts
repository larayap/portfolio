// Throttle: Limita la frecuencia de ejecución de una función
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// Debounce: Espera a que se detenga la actividad antes de ejecutar
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// RequestIdleCallback polyfill
export const requestIdleCallbackPolyfill = (callback: () => void): void => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
};

// Detectar capacidad del dispositivo
export const getDevicePerformance = (): 'high' | 'medium' | 'low' => {
  // Detectar por características del navegador y hardware
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connection = (navigator as any).connection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memory = (performance as any).memory;

  // Si hay información de conexión lenta
  if (connection && connection.effectiveType) {
    if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
      return 'low';
    }
  }

  // Si hay información de memoria
  if (memory && memory.jsHeapSizeLimit) {
    const memoryGB = memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
    if (memoryGB < 1) return 'low';
    if (memoryGB < 2) return 'medium';
  }

  // Detectar por hardware concurrency (núcleos de CPU)
  if (navigator.hardwareConcurrency) {
    if (navigator.hardwareConcurrency <= 2) return 'low';
    if (navigator.hardwareConcurrency <= 4) return 'medium';
  }

  // Por defecto, asumir capacidad alta
  return 'high';
};

// Monitor de FPS
export class FPSMonitor {
  private frames: number[] = [];
  private lastTime = performance.now();

  update(): number {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    const fps = 1000 / delta;
    this.frames.push(fps);

    // Mantener solo los últimos 60 frames
    if (this.frames.length > 60) {
      this.frames.shift();
    }

    return fps;
  }

  getAverage(): number {
    if (this.frames.length === 0) return 60;
    const sum = this.frames.reduce((a, b) => a + b, 0);
    return sum / this.frames.length;
  }

  isPerformanceGood(): boolean {
    return this.getAverage() >= 30;
  }
}
