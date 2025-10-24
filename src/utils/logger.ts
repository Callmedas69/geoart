/**
 * Secure Logging Utility
 *
 * Prevents sensitive data exposure in production logs.
 * Follow KISS principle: Simple, secure, no over-engineering.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Development-only logs - Never shown in production
   */
  dev: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(message, ...args);
    }
  },

  /**
   * Production-safe logs - Always shown
   */
  info: (message: string, ...args: any[]) => {
    console.log(message, ...args);
  },

  /**
   * Error logs - Always shown (safe data only)
   */
  error: (message: string, error?: any) => {
    if (error instanceof Error) {
      console.error(message, error.message);
    } else {
      console.error(message, error);
    }
  },

  /**
   * Logs sensitive data safely - Redacted in production
   */
  sensitive: (message: string, sensitiveData: string) => {
    if (isDevelopment) {
      const preview = sensitiveData.substring(0, 8) + '...';
      console.log(message, preview);
    } else {
      console.log(message, '[REDACTED]');
    }
  },

  /**
   * Success logs - Always shown
   */
  success: (message: string, ...args: any[]) => {
    console.log(message, ...args);
  },

  /**
   * Warning logs - Always shown
   */
  warn: (message: string, ...args: any[]) => {
    console.warn(message, ...args);
  },
};
