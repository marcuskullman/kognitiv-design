interface Props extends Samples {
  mean: number
  MDE: number
  CR: number
  startTime?: number
  minDays?: number
  minConversionsPerSample?: number
}

interface Result {
  sampleSize: number
  sampleSizeStr: string
  fixedHorizon: boolean
}

const roundToSigFigs = (numberToRound: number, sigFigs: number = 2): number => {
  const n = Math.round(numberToRound)
  const mult = Math.pow(10, sigFigs - Math.floor(Math.log(n) / Math.LN10) - 1)
  const roundOnce = Math.round(n * mult) / mult

  return Math.round(roundOnce)
}

const calcSampleEstimate = (
  marginOfError: number,
  variance: number,
  theta: number
): number =>
  (2 *
    (1 - marginOfError) *
    variance *
    Math.log(1 + Math.sqrt(variance) / theta)) /
  (theta * theta)

const calcVariance = (c1: number, c2: number): number =>
  c1 * (1 - c1) + c2 * (1 - c2)

const sampleSizeEstimate = (
  relativeMDE: number,
  baselineCR: number,
  statisticalSignificance: number = 0.95
): number => {
  const marginOfError = 1 - statisticalSignificance
  const absoluteMDE = baselineCR * relativeMDE
  const c2 = baselineCR - absoluteMDE
  const c3 = baselineCR + absoluteMDE
  const theta = Math.abs(absoluteMDE)
  const variance1 = calcVariance(baselineCR, c2)
  const variance2 = calcVariance(baselineCR, c3)
  const sampleEstimate1 = calcSampleEstimate(marginOfError, variance1, theta)
  const sampleEstimate2 = calcSampleEstimate(marginOfError, variance2, theta)
  const sampleEstimate =
    Math.abs(sampleEstimate1) >= Math.abs(sampleEstimate2)
      ? sampleEstimate1
      : sampleEstimate2

  if (!isFinite(sampleEstimate) || sampleEstimate < 0) {
    return NaN
  }

  return roundToSigFigs(sampleEstimate)
}

export const useSampleSizeCalculator = ({
  a,
  b,
  testStatistic,
  MDE,
  CR,
  mean,
  startTime = +new Date(),
  minDays = 14,
  minConversionsPerSample = 100,
}: Props): Result => {
  const relativeMDE = MDE ? MDE / 100 : testStatistic / 100
  const baselineCR = CR ? CR / 100 : mean
  const sampleSize = sampleSizeEstimate(relativeMDE, baselineCR)

  const fhConversions =
    a.conversions >= minConversionsPerSample &&
    b.conversions >= minConversionsPerSample

  const fhDuration =
    Math.ceil((minDays * 86400000 - (+new Date() - startTime)) / 86400000) <= 0

  return {
    sampleSize,
    sampleSizeStr: `${sampleSize} (per variation)`,
    fixedHorizon: fhConversions && fhDuration,
  } as Result
}
