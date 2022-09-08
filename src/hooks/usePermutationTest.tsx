type Dataset = [
  {
    variation: "a" | "b"
    converted: boolean
  }
]

type Distribution = {
  [key: string]: number
}

interface Props {
  dataset: Dataset
  simulations?: number
}

interface PermutationTest {
  samples: Samples
  permutationTest: Pick<Props, "simulations"> & {
    distribution: Distribution
    pValue: number
    statisticalSignificance: string
  }
}

const reduceData = ({
  dataset,
  shuffle = false,
}: {
  dataset: Dataset
  shuffle?: boolean
}): Samples => {
  const clone = shuffle ? [...dataset] : []

  const {
    a,
    b,
  }: {
    a: Variation
    b: Variation
  } = dataset.reduce(
    (acc, { converted, variation }) => {
      if (shuffle) {
        const index = Math.floor(Math.random() * clone.length)
        variation = clone[index].variation
        clone.splice(index, 1)
      }

      acc[variation].count += 1

      if (converted) {
        acc[variation].conversions += 1
      }

      return acc
    },
    {
      a: {
        count: 0,
        conversions: 0,
        conversionRate: 0,
      },
      b: {
        count: 0,
        conversions: 0,
        conversionRate: 0,
      },
    }
  )

  const conversionRateA = a.conversions / a.count
  const conversionRateB = b.conversions / b.count

  return {
    a: { ...a, conversionRate: conversionRateA },
    b: { ...b, conversionRate: conversionRateB },
    testStatistic:
      (100 * (conversionRateB - conversionRateA)) / conversionRateA,
  } as Samples
}

export const usePermutationTest = ({
  dataset,
  simulations = 5000,
}: Props): PermutationTest => {
  const samples = reduceData({ dataset })
  const distribution: Distribution = {}
  let sum = 0

  for (let i = 0; i < simulations; i++) {
    const { a, b, testStatistic } = reduceData({ dataset, shuffle: true })
    const key = `A${a.conversions}-B${b.conversions}`
    distribution[key] = (distribution[key] || 0) + 1

    if (testStatistic >= samples.testStatistic) {
      sum += 1
    }
  }

  const pValue = sum / simulations
  const statisticalSignificance = 1 - pValue

  return {
    samples,
    permutationTest: {
      simulations,
      distribution,
      pValue,
      statisticalSignificance: `${(100 * statisticalSignificance).toFixed(2)}%`,
    },
  } as PermutationTest
}
