declare module '@prisma/client';
declare module 'bcryptjs';
declare module 'next';
declare module 'next/link';
declare module 'next-auth';
declare module 'next-auth/react';
declare module 'next-auth/providers/credentials';
declare module 'next-auth/providers/google';
declare module '@next-auth/prisma-adapter';
declare module 'react';
declare module 'zod';
declare module 'xlsx';
declare module 'openai';
declare module 'ioredis';
declare module '@aws-sdk/client-s3';
declare module 'bullmq';
declare module 'tailwindcss';

declare const process: any;
declare const Buffer: any;

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare function require(name: string): any;
