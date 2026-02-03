declare module '@radix-ui/react-slot' {
  import * as React from 'react';
  export const Slot: React.ComponentType<any>;
  export default Slot;
}

declare module 'class-variance-authority' {
  export function cva(base?: any, opts?: any): any;
  export type VariantProps<T> = Record<string, any>;
}
