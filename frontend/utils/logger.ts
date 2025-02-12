const logger =
  process.env.NODE_ENV !== "production"
    ? {
        info: (message: string, meta?: object) => {
          console.log(
            `[INFO] ${message}`,
            meta ? JSON.stringify(meta, null, 2) : "",
          );
        },
        error: (message: string, meta?: object) => {
          console.error(
            `[ERROR] ${message}`,
            meta ? JSON.stringify(meta, null, 2) : "",
          );
        },
        warn: (message: string, meta?: object) => {
          console.warn(
            `[WARN] ${message}`,
            meta ? JSON.stringify(meta, null, 2) : "",
          );
        },
        debug: (message: string, meta?: object) => {
          console.debug(
            `[DEBUG] ${message}`,
            meta ? JSON.stringify(meta, null, 2) : "",
          );
        },
      }
    : {
        info: () => {},
        error: () => {},
        warn: (message: string, meta?: object) => {
          console.warn(
            `[WARN] ${message}`,
            meta ? JSON.stringify(meta, null, 2) : "",
          );
        },
        debug: () => {},
      };

export default logger;
