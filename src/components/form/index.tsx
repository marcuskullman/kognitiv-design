import { ChangeEvent, FC } from "react"

interface Props {
  handleChange: (target: ChangeEvent<HTMLInputElement>) => void
  MDE: number
  CR: number
}

const Form: FC<Props> = ({ handleChange, MDE, CR }) => {
  return (
    <form data-testid="form">
      <label>MDE:</label>
      <input
        type="number"
        name="MDE"
        onChange={e => handleChange(e)}
        value={MDE || ""}
      />
      %
      <br />
      <br />
      <label>CR</label>
      <input
        type="number"
        name="CR"
        onChange={e => handleChange(e)}
        value={CR || ""}
      />
      %
    </form>
  )
}

export default Form
