import { ncdf } from "../utils/helpers"

interface Props {
  a: Variation
  b: Variation
}

interface Result {
  standardDeviation: number
  aStdError: number
  bStdError: number
  mean: number
  pValue: number
  zScore: number
  power: number
  seDiff: number
  positive: boolean
  statisticalSignificance: string
}

const standardDeviation = (arr: number[], mean: number): number => {
  const sum = arr.reduce((acc, cur) => acc + (cur - mean) * (cur - mean), 0)
  return Math.sqrt(sum / (arr.length - 1))
}

export const useAbTest = ({ a, b }: Props): Result => {
  const mean = (a.conversionRate + b.conversionRate) / 2
  const aStdError = Math.sqrt(
    (a.conversionRate * (1 - a.conversionRate)) / a.count
  )
  const bStdError = Math.sqrt(
    (b.conversionRate * (1 - b.conversionRate)) / b.count
  )
  const seDiff = Math.sqrt(Math.pow(aStdError, 2) + Math.pow(bStdError, 2))
  const zScore = (b.conversionRate - a.conversionRate) / seDiff
  const pValue = 1 - ncdf(zScore, 0, 1)
  const statisticalSignificance = 1 - pValue
  const power =
    1 -
    ncdf(
      (a.conversionRate + aStdError * 1.644853 - b.conversionRate) / bStdError,
      0,
      1
    )

  return {
    standardDeviation: standardDeviation(
      [a.conversionRate, b.conversionRate],
      mean
    ),
    aStdError,
    bStdError,
    mean,
    pValue,
    zScore,
    power,
    seDiff,
    positive: b.conversionRate > a.conversionRate,
    statisticalSignificance: `${(100 * statisticalSignificance).toFixed(2)}%`,
  } as Result
}
