export const ibeta = (x: number, a: number, b: number): number | boolean => {
  const bt =
    x === 0 || x === 1
      ? 0
      : Math.exp(
          gammaln(a + b) -
            gammaln(a) -
            gammaln(b) +
            a * Math.log(x) +
            b * Math.log(1 - x)
        )

  if (x < 0 || x > 1) return false

  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betacf(x, a, b)) / a
  }

  return 1 - (bt * betacf(1 - x, b, a)) / b
}

export const gammaln = (x: number): number => {
  const cof = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5,
  ]

  let j = 0
  let ser = 1.000000000190015
  let xx: number
  let y: number
  let tmp: number

  tmp = (y = xx = x) + 5.5
  tmp -= (xx + 0.5) * Math.log(tmp)
  for (; j < 6; j++) ser += cof[j] / ++y

  return Math.log((2.5066282746310005 * ser) / xx) - tmp
}

// Lentz's method.
export const betacf = function betacf(x: number, a: number, b: number) {
  let fpmin = 1e-30
  let m = 1
  let qab = a + b
  let qap = a + 1
  let qam = a - 1
  let c = 1
  let d = 1 - (qab * x) / qap
  let m2, aa, del, h

  if (Math.abs(d) < fpmin) d = fpmin
  d = 1 / d
  h = d

  for (; m <= 100; m++) {
    m2 = 2 * m
    aa = (m * (b - m) * x) / ((qam + m2) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < fpmin) d = fpmin
    c = 1 + aa / c
    if (Math.abs(c) < fpmin) c = fpmin
    d = 1 / d
    h *= d * c
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2))
    d = 1 + aa * d
    if (Math.abs(d) < fpmin) d = fpmin
    c = 1 + aa / c
    if (Math.abs(c) < fpmin) c = fpmin
    d = 1 / d
    del = d * c
    h *= del
    if (Math.abs(del - 1.0) < 3e-7) break
  }

  return h
}

export const ncdf = (zScore: number, mean: number, sd: number): number => {
  zScore = (zScore - mean) / sd
  const t = 1 / (1 + 0.2315419 * Math.abs(zScore))
  const d = 0.3989423 * Math.exp((-zScore * zScore) / 2)
  let prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))

  if (zScore > 0) prob = 1 - prob

  return prob
}
