import React from 'react';
import { LinkProps } from 'next/link';

declare module 'next/link' {
  interface DefaultExport extends React.ForwardRefExoticComponent<
    React.PropsWithChildren<LinkProps> & React.RefAttributes<HTMLAnchorElement>
  > {}
}
