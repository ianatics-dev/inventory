interface Navigator {
    wakeLock?: {
      request: (type: 'screen') => Promise<any>;
    };
  }