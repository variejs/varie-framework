import max from "../../../src/validation/rules/max";

test("test max rule", () => {
  expect(max.passes("asd", [3])).toBe(true);
  expect(max.passes("123", [3])).toBe(true);
  expect(max.passes("1234", [3])).toBe(false);

  expect(max.passes(9, [10])).toBe(true);
  expect(max.passes(10, [10])).toBe(true);
  expect(max.passes(123, [10])).toBe(false);

  // act as a file
  expect(
    max.passes(
      {
        size: 3500000, // 3500 kb
      },
      [4000],
    ),
  ).toBe(true);

  expect(
    max.passes(
      {
        size: 4096000, // 4000 kb
      },
      [4000],
    ),
  ).toBe(true);

  expect(
    max.passes(
      {
        size: 5500000, // 5500 kb
      },
      [4000],
    ),
  ).toBe(false);
});
