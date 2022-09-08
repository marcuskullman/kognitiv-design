import { FC, useReducer, ChangeEvent } from "react"
import Form from "./components/form"
import {
  useTTest,
  usePermutationTest,
  useAbTest,
  useSampleSizeCalculator,
} from "./hooks"

const App: FC = () => {
  const mockdata1 = require("./test/mockdata-1.json")
  const mockdata2 = require("./test/mockdata-2.json")

  const unpairedTTest = useTTest({ dataset: mockdata1, type: "unpaired" })
  console.log("Unpaired T-test:", unpairedTTest)

  const pairedTTest = useTTest({ dataset: mockdata1, type: "paired" })
  console.log("Paired T-test:", pairedTTest)

  const { samples, permutationTest } = usePermutationTest({
    dataset: mockdata2,
  })
  console.log("Samples:", samples)
  console.log("Permutation test:", permutationTest)

  const abTest = useAbTest(samples)
  console.log("A/B-test", abTest)

  // Nedan är relaterat till Provstorlekskalkylatorn

  const [{ MDE, CR }, setState]: IState = useReducer(
    (state: IDefaultState, action: IDefaultStateDraft) => ({
      ...state,
      ...action,
    }),
    {
      MDE: samples.testStatistic,
      CR: (100 * (samples.a.conversionRate + samples.b.conversionRate)) / 2,
    }
  )

  const props = {
    MDE,
    CR,
    handleChange: ({
      target: { name, value },
    }: ChangeEvent<HTMLInputElement>): void =>
      setState({ [name]: Number(value) }),
  }

  const sampleSize = useSampleSizeCalculator({
    ...samples,
    mean: abTest.mean,
    MDE,
    CR,
  })

  console.log("Sample size:", sampleSize)

  return <Form {...props} />
}

export default App
