import {
  useTTest,
  usePermutationTest,
  useAbTest,
  useSampleSizeCalculator,
} from "../hooks"

describe("Hooks", () => {
  const mockdata1 = require("./mockdata-1.json")
  const mockdata2 = require("./mockdata-2.json")

  const unpairedTTest = useTTest({
    dataset: mockdata1,
    type: "unpaired",
  })

  test("Unpaired T-test", () => {
    expect(unpairedTTest.tValue).toEqual(2.0878332165036553)
  })

  const pairedTTest = useTTest({
    dataset: mockdata1,
    type: "paired",
  })

  test("Paired T-test", () => {
    expect(pairedTTest.tValue).toEqual(2.0435773025656268)
  })

  const { samples } = usePermutationTest({ dataset: mockdata2 })

  test("Permutationstest", () => {
    expect(samples.testStatistic).toEqual(66.66666666666667)
  })

  const abTest = useAbTest(samples)

  test("A/B-test", () => {
    expect(abTest.pValue).toEqual(0.17557587846027556)
    expect(abTest.positive).toBe(true)
  })

  const { sampleSize } = useSampleSizeCalculator({
    ...samples,
    mean: abTest.mean,
    MDE: 10,
    CR: 10,
  })

  test("Sample size", () => {
    expect(sampleSize).toEqual(14000)
  })
})
