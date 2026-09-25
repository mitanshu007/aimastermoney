import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "local-db.json");

function decimal(value) {
  const number = Number(value ?? 0);
  return {
    toNumber() {
      return number;
    },
    valueOf() {
      return number;
    },
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function reviveDate(value) {
  if (!value) return value;
  return value instanceof Date ? value : new Date(value);
}

function withDecimals(record, model) {
  if (!record) return record;

  const next = { ...record };

  if (model === "account") {
    next.balance = decimal(next.balance);
  }

  if (model === "transaction" || model === "budget") {
    next.amount = decimal(next.amount);
  }

  return next;
}

function sortRows(rows, orderBy) {
  if (!orderBy) return rows;

  const [[field, direction]] = Object.entries(orderBy);
  const factor = direction === "desc" ? -1 : 1;

  return [...rows].sort((a, b) => {
    const left = a[field] instanceof Date ? a[field].getTime() : a[field];
    const right = b[field] instanceof Date ? b[field].getTime() : b[field];

    if (left < right) return -1 * factor;
    if (left > right) return 1 * factor;
    return 0;
  });
}

function matchesWhere(row, where = {}) {
  return Object.entries(where).every(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      if ("in" in value) {
        return value.in.includes(row[key]);
      }

      if ("gte" in value || "lte" in value) {
        const rowValue = row[key] instanceof Date ? row[key].getTime() : reviveDate(row[key]).getTime();
        const min = value.gte ? reviveDate(value.gte).getTime() : Number.NEGATIVE_INFINITY;
        const max = value.lte ? reviveDate(value.lte).getTime() : Number.POSITIVE_INFINITY;
        return rowValue >= min && rowValue <= max;
      }

      return matchesWhere(row[key], value);
    }

    return row[key] === value;
  });
}

function applyDataUpdate(row, data) {
  const next = { ...row };

  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && "increment" in value) {
      next[key] = Number(next[key] ?? 0) + Number(value.increment);
      continue;
    }

    next[key] = value;
  }

  next.updatedAt = new Date();
  return next;
}

async function ensureDbFile() {
  await mkdir(path.dirname(DB_PATH), { recursive: true });

  try {
    await readFile(DB_PATH, "utf8");
  } catch {
    const initialState = {
      users: [],
      accounts: [],
      transactions: [],
      budgets: [],
    };

    await writeFile(DB_PATH, JSON.stringify(initialState, null, 2), "utf8");
  }
}

async function loadState() {
  await ensureDbFile();
  const raw = await readFile(DB_PATH, "utf8");
  const state = JSON.parse(raw);

  state.users = state.users.map((row) => ({
    ...row,
    createdAt: reviveDate(row.createdAt),
    updatedAt: reviveDate(row.updatedAt),
  }));
  state.accounts = state.accounts.map((row) => ({
    ...row,
    balance: Number(row.balance ?? 0),
    createdAt: reviveDate(row.createdAt),
    updatedAt: reviveDate(row.updatedAt),
  }));
  state.transactions = state.transactions.map((row) => ({
    ...row,
    amount: Number(row.amount ?? 0),
    date: reviveDate(row.date),
    nextRecurringDate: reviveDate(row.nextRecurringDate),
    lastProcessed: reviveDate(row.lastProcessed),
    createdAt: reviveDate(row.createdAt),
    updatedAt: reviveDate(row.updatedAt),
  }));
  state.budgets = state.budgets.map((row) => ({
    ...row,
    amount: Number(row.amount ?? 0),
    lastAlertSent: reviveDate(row.lastAlertSent),
    createdAt: reviveDate(row.createdAt),
    updatedAt: reviveDate(row.updatedAt),
  }));

  return state;
}

async function saveState(state) {
  const serialized = JSON.stringify(
    state,
    (key, value) => (value instanceof Date ? value.toISOString() : value),
    2
  );

  await writeFile(DB_PATH, serialized, "utf8");
}

function createClient(state, persist) {
  const modelMap = {
    user: "users",
    account: "accounts",
    transaction: "transactions",
    budget: "budgets",
  };

  function getRows(model) {
    return state[modelMap[model]];
  }

  function attachIncludes(model, row, include) {
    if (!row || !include) return withDecimals(row, model);

    let next = withDecimals(row, model);

    if (model === "account" && include.transactions) {
      const txs = getRows("transaction").filter((item) => item.accountId === row.id);
      next.transactions = sortRows(txs, include.transactions.orderBy).map((item) =>
        withDecimals(item, "transaction")
      );
    }

    if (model === "account" && include._count?.select?.transactions) {
      next._count = {
        transactions: getRows("transaction").filter((item) => item.accountId === row.id).length,
      };
    }

    if (model === "transaction" && include.account) {
      const account = getRows("account").find((item) => item.id === row.accountId);
      next.account = withDecimals(account, "account");
    }

    return next;
  }

  async function findUnique(model, args = {}) {
    const row = getRows(model).find((item) => matchesWhere(item, args.where));
    return attachIncludes(model, row ? clone(row) : null, args.include);
  }

  async function findFirst(model, args = {}) {
    const filtered = getRows(model).filter((item) => matchesWhere(item, args.where));
    const row = sortRows(filtered, args.orderBy)[0] ?? null;
    return attachIncludes(model, row ? clone(row) : null, args.include);
  }

  async function findMany(model, args = {}) {
    const filtered = getRows(model).filter((item) => matchesWhere(item, args.where));
    return sortRows(filtered, args.orderBy).map((item) =>
      attachIncludes(model, clone(item), args.include)
    );
  }

  async function create(model, args = {}) {
    const now = new Date();
    const row = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...args.data,
    };

    if (model === "account") row.balance = Number(row.balance ?? 0);
    if (model === "transaction") row.amount = Number(row.amount ?? 0);
    if (model === "budget") row.amount = Number(row.amount ?? 0);

    getRows(model).push(row);
    await persist();
    return withDecimals(clone(row), model);
  }

  async function update(model, args = {}) {
    const rows = getRows(model);
    const index = rows.findIndex((item) => matchesWhere(item, args.where));

    if (index === -1) {
      throw new Error(`${model} not found`);
    }

    rows[index] = applyDataUpdate(rows[index], args.data);
    await persist();
    return attachIncludes(model, clone(rows[index]), args.include);
  }

  async function updateMany(model, args = {}) {
    const rows = getRows(model);
    let count = 0;

    rows.forEach((row, index) => {
      if (!matchesWhere(row, args.where)) return;
      rows[index] = applyDataUpdate(row, args.data);
      count += 1;
    });

    await persist();
    return { count };
  }

  async function deleteMany(model, args = {}) {
    const rows = getRows(model);
    const kept = rows.filter((item) => !matchesWhere(item, args.where));
    const count = rows.length - kept.length;
    state[modelMap[model]] = kept;
    await persist();
    return { count };
  }

  async function deleteOne(model, args = {}) {
    const rows = getRows(model);
    const index = rows.findIndex((item) => matchesWhere(item, args.where));

    if (index === -1) {
      throw new Error(`${model} not found`);
    }

    const [deleted] = rows.splice(index, 1);
    await persist();
    return withDecimals(clone(deleted), model);
  }

  async function aggregate(model, args = {}) {
    const rows = getRows(model).filter((item) => matchesWhere(item, args.where));
    if (args._sum?.amount) {
      return {
        _sum: {
          amount: decimal(rows.reduce((sum, item) => sum + Number(item.amount ?? 0), 0)),
        },
      };
    }

    return { _sum: {} };
  }

  async function upsert(model, args = {}) {
    const existing = getRows(model).find((item) => matchesWhere(item, args.where));
    if (existing) {
      return update(model, { where: args.where, data: args.update });
    }
    return create(model, { data: args.create });
  }

  return {
    user: {
      findUnique: (args) => findUnique("user", args),
      create: (args) => create("user", args),
    },
    account: {
      findUnique: (args) => findUnique("account", args),
      findMany: (args) => findMany("account", args),
      create: (args) => create("account", args),
      update: (args) => update("account", args),
      updateMany: (args) => updateMany("account", args),
      delete: (args) => deleteOne("account", args),
    },
    transaction: {
      findUnique: (args) => findUnique("transaction", args),
      findMany: (args) => findMany("transaction", args),
      create: (args) => create("transaction", args),
      update: (args) => update("transaction", args),
      deleteMany: (args) => deleteMany("transaction", args),
      aggregate: (args) => aggregate("transaction", args),
    },
    budget: {
      findFirst: (args) => findFirst("budget", args),
      upsert: (args) => upsert("budget", args),
    },
  };
}

export const db = {
  async $transaction(callback) {
    const state = await loadState();
    const workingState = clone(state);

    workingState.users = workingState.users.map((row) => ({
      ...row,
      createdAt: reviveDate(row.createdAt),
      updatedAt: reviveDate(row.updatedAt),
    }));
    workingState.accounts = workingState.accounts.map((row) => ({
      ...row,
      balance: Number(row.balance ?? 0),
      createdAt: reviveDate(row.createdAt),
      updatedAt: reviveDate(row.updatedAt),
    }));
    workingState.transactions = workingState.transactions.map((row) => ({
      ...row,
      amount: Number(row.amount ?? 0),
      date: reviveDate(row.date),
      nextRecurringDate: reviveDate(row.nextRecurringDate),
      lastProcessed: reviveDate(row.lastProcessed),
      createdAt: reviveDate(row.createdAt),
      updatedAt: reviveDate(row.updatedAt),
    }));
    workingState.budgets = workingState.budgets.map((row) => ({
      ...row,
      amount: Number(row.amount ?? 0),
      lastAlertSent: reviveDate(row.lastAlertSent),
      createdAt: reviveDate(row.createdAt),
      updatedAt: reviveDate(row.updatedAt),
    }));

    const tx = createClient(workingState, async () => {});
    const result = await callback(tx);
    await saveState(workingState);
    return result;
  },
};

const rootClient = {
  ...createClient(
    { users: [], accounts: [], transactions: [], budgets: [] },
    async () => {}
  ),
};

for (const key of Object.keys(rootClient)) {
  if (key === "$transaction") continue;
  db[key] = new Proxy(
    {},
    {
      get(_, prop) {
        return async (...args) => {
          const state = await loadState();
          const client = createClient(state, () => saveState(state));
          return client[key][prop](...args);
        };
      },
    }
  );
}
