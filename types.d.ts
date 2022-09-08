interface IDefaultState {
  MDE: number
  CR: number
}

interface IDefaultStateDraft extends Partial<IDefaultState> {}

type IState = [IDefaultState, (action: IDefaultStateDraft) => void]

type Variation = {
  count: number
  conversions: number
  conversionRate: number
}

type Samples = {
  a: Variation
  b: Variation
  testStatistic: number
}
