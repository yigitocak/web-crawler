import { expect, test } from "@jest/globals";
import { sortPages } from "./report.js";

test("sortPages 2 pages", () => {
  const input = {
    "https://wagslane.dev/path": 1,
    "https://wagslane.dev": 3,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://wagslane.dev", 3],
    ["https://wagslane.dev/path", 1],
  ];
  expect(actual).toEqual(expected);
});

test("sortPages 5 pages", () => {
  const input = {
    "https://wagslane.dev/path": 7,
    "https://wagslane.dev": 3,
    "https://wagslane.dev/path2": 2,
    "https://wagslane.dev/path3": 9,
    "https://wagslane.dev/path4": 1,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://wagslane.dev/path3", 9],
    ["https://wagslane.dev/path", 7],
    ["https://wagslane.dev", 3],
    ["https://wagslane.dev/path2", 2],
    ["https://wagslane.dev/path4", 1],
  ];
  expect(actual).toEqual(expected);
});
