/**
 * Type representing a logger function.
 * @template T - The type of data the logger function accepts.
 */
type LoggerFn<T> = (data: T) => void;

/**
 * Type representing logger data.
 * @template T - The type of the data object.
 */
export type LoggerData<T extends object> = T & {
    /**
     * The method used for logging.
     */
    method: string;
};

/**
 * Type representing logger options.
 * @template T - The type of the data object.
 * @template Fields - The keys of the data object.
 */
export type LoggerOptions<T, Fields extends keyof T> = {
    /**
     * The logger configuration, which can be one of three types:
     * - 'all': log all fields, optionally using a custom logger function.
     * - 'omit': omit certain fields from logging, optionally using a custom logger function.
     * - 'pick': log only certain fields, optionally using a custom logger function.
     */
    logger:
        | {
              type?: 'all';
              /**
               * An optional custom logger function for logging all fields.
               */
              loggerFn?: LoggerFn<T>;
          }
        | {
              type: 'omit';
              fields: Fields[];
              /**
               * An optional custom logger function for logging all fields except those specified.
               */
              loggerFn?: LoggerFn<Omit<T, Fields>>;
          }
        | {
              type: 'pick';
              fields: Fields[];
              /**
               * An optional custom logger function for logging only the specified fields.
               */
              loggerFn?: LoggerFn<Pick<T, Fields>>;
          };
};
