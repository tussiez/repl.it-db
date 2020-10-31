const fetch = require("node-fetch");
const Client = require("./index");

let client;

beforeAll(async () => {
  const pass = process.env.PASSWORD;
  
  if (pass) {
    const resp = await fetch("https://database-test-jwt.kochman.repl.co", {
      headers: {
        Authorization: "Basic " + btoa("test:" + pass),
      },
    });
    const url = await resp.text();
    client = new Client(url);
  } else {
    client = new Client();
  }

  await client.empty();
});

afterEach(async () => {
  await client.empty();
});

test("create a client with a key", async () => {
  expect(client).toBeTruthy();
  expect(typeof client.key).toBe("string");
});

test("sets a value", async () => {
  expect(await client.set("key", "value")).toEqual(client);
  expect(await client.setAll({ key: "value", second: "secondThing" })).toEqual(
    client
  );
});

test("list keys", async () => {
  await client.setAll({
    key: "value",
    second: "secondThing",
  });

  expect(await client.list()).toEqual(["key", "second"]);
});

test("gets a value", async () => {
  await client.setAll({
    key: "value",
  });

  expect(await client.getAll()).toEqual({ key: "value" });
});

test("delete a value", async () => {
  await client.setAll({
    key: "value",
    deleteThis: "please",
    somethingElse: "in delete multiple",
    andAnother: "again same thing",
  });

  expect(await client.delete("deleteThis")).toEqual(client);
  expect(await client.deleteMultiple("somethingElse", "andAnother")).toEqual(
    client
  );
  expect(await client.list()).toEqual(["key"]);
  expect(await client.empty()).toEqual(client);
  expect(await client.list()).toEqual([]);
});

test("list keys with newline", async () => {
  await client.setAll({
    "key\nwith": "first",
    keywithout: "second",
  });

  expect(await client.list()).toEqual(["key\nwith", "keywithout"]);
});

test("list keys as object", async () => {
  await client.setAll({
    key1: 1,
    key2: 2
  })

  expect(await client.listAllAsObject()).toEqual([
    {
      key: "key1",
      value: 1
    },
    {
      key: "key2",
      value: 2
    }
  ]);
})