const noop = () => {};
const format = (obj: any, msg?: string) => {
  const base = { level: obj?.level ?? 30, time: Date.now() };
  if (typeof obj === "string") return { ...base, msg: obj };
  return { ...base, ...obj, msg: msg || obj?.msg };
};
export const logger = {
  info: (obj: any, msg?: string) => console.log(JSON.stringify(format(obj, msg))),
  warn: (obj: any, msg?: string) => console.log(JSON.stringify(format(obj, msg))),
  error: (obj: any, msg?: string) => console.error(JSON.stringify(format(obj, msg))),
  debug: noop,
  trace: noop,
  fatal: (obj: any, msg?: string) => { console.error(JSON.stringify(format(obj, msg))); process.exit(1); },
  child: () => logger,
  level: "info",
};
