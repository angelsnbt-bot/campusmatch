export interface StoreAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlMs?: number): Promise<void>;
  del(key: string): Promise<void>;
  incr(key: string, ttlMs?: number): Promise<number>;
  has(key: string): Promise<boolean>;
}

class MemoryStore implements StoreAdapter {
  private data = new Map<string, { value: string; expiresAt?: number }>();

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.data) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.data.delete(key);
      }
    }
  }

  async get(key: string): Promise<string | null> {
    this.cleanup();
    const entry = this.data.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.data.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlMs?: number): Promise<void> {
    this.data.set(key, { value, expiresAt: ttlMs ? Date.now() + ttlMs : undefined });
  }

  async del(key: string): Promise<void> {
    this.data.delete(key);
  }

  async incr(key: string, ttlMs?: number): Promise<number> {
    const existing = await this.get(key);
    const count = (existing ? parseInt(existing, 10) : 0) + 1;
    await this.set(key, count.toString(), ttlMs);
    return count;
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== null;
  }
}

class RedisStore implements StoreAdapter {
  private redis: any;
  private prefix: string;

  constructor(config: { url: string; prefix?: string }) {
    this.prefix = config.prefix ?? "cm:";
    this.redis = null;
    this.connect(config.url);
  }

  private async connect(url: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = await (Function("return import('redis')")() as Promise<any>);
      const createClient = mod.createClient;
      this.redis = createClient({ url });
      this.redis.on("error", (err: any) => {
        console.error("Redis connection error:", err);
      });
      await this.redis.connect();
    } catch {
      console.warn("Redis unavailable, falling back to in-memory store");
      this.redis = null;
    }
  }

  private key(k: string): string {
    return `${this.prefix}${k}`;
  }

  async get(key: string): Promise<string | null> {
    if (!this.redis) return null;
    return this.redis.get(this.key(key));
  }

  async set(key: string, value: string, ttlMs?: number): Promise<void> {
    if (!this.redis) return;
    if (ttlMs) {
      await this.redis.setEx(this.key(key), Math.ceil(ttlMs / 1000), value);
    } else {
      await this.redis.set(this.key(key), value);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.redis) return;
    await this.redis.del(this.key(key));
  }

  async incr(key: string, ttlMs?: number): Promise<number> {
    if (!this.redis) return 0;
    const k = this.key(key);
    const count = await this.redis.incr(k);
    if (count === 1 && ttlMs) {
      await this.redis.expire(k, Math.ceil(ttlMs / 1000));
    }
    return count;
  }

  async has(key: string): Promise<boolean> {
    if (!this.redis) return false;
    return (await this.redis.exists(this.key(key))) === 1;
  }
}

export function createStore(): StoreAdapter {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    return new RedisStore({ url: redisUrl });
  }
  return new MemoryStore();
}

export const store = createStore();
