import { ibeta } from "../utils/helpers"

type Dataset = number[][]

type TestType = "paired" | "unpaired"

type Treatment = {
  [key: string]: number
}

interface Props {
  dataset: Dataset
  type: TestType
}

interface Result {
  type: TestType
  tValue: number
}

const pairedTest = (dataset: Dataset): number => {
  const treatment1 = dataset[0]
  const treatment2 = dataset[1]

  const n = treatment1.length

  if (!n || n !== treatment2.length) {
    console.log("Dataset A och B måsta vara lika stora")
    return 0
  }

  const deviations = treatment1.map((val, i) => treatment2[i] - val)
  const m = deviations.reduce((a, b) => a + b, 0) / n
  const ss = deviations.reduce((a, b) => a + Math.pow(b - m, 2), 0)
  const df = n - 1
  const s2 = ss / df
  const s2m = s2 / n
  const sm = Math.sqrt(s2m)
  const tValue = Math.abs(m / sm)

  // WIP - Beräkna P från T
  const df2 = df / 2
  const statisticalSignificance = ibeta(
    (tValue + Math.sqrt(tValue * tValue + df)) /
      (2 * Math.sqrt(tValue * tValue + df)),
    df2,
    df2
  )

  console.log(
    "Statistical significance:",
    statisticalSignificance
      ? `${(100 * (statisticalSignificance as number)).toFixed(2)}%`
      : "Resultatet är inte signifikant"
  )

  return tValue
}

const unpairedTest = (dataset: Dataset): number => {
  const samples = dataset.reduce((acc, curr, i) => {
    const n = curr.length
    const df = n - 1
    const m = curr.reduce((a, b) => a + b, 0) / n
    const s2 = curr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / df

    acc[i] = { n, df, m, s2 }

    return acc
  }, {} as { [key: string]: Treatment })

  const treatment1 = samples[0]
  const treatment2 = samples[1]

  const s2p =
    (treatment1.df / (treatment1.df + treatment2.df)) * treatment1.s2 +
    (treatment2.df / (treatment2.df + treatment2.df)) * treatment2.s2

  const s2m1 = s2p / treatment1.n
  const s2m2 = s2p / treatment2.n

  const tValue = (treatment1.m - treatment2.m) / Math.sqrt(s2m1 + s2m2)

  // TODO - Beräkna P från T

  return tValue
}

export const useTTest = ({ dataset, type }: Props): Result => ({
  type,
  tValue: (() => {
    switch (type) {
      case "paired":
        return pairedTest(dataset)
      case "unpaired":
        return unpairedTest(dataset)
    }
  })(),
})
