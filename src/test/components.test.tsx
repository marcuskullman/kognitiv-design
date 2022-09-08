import { render, screen } from "@testing-library/react"
import App from "../App"

describe("App", () => {
  test("Renders", () => {
    const { container } = render(<App />)
    expect(container).toMatchSnapshot()

    const form = screen.getByTestId("form")
    expect(form).toBeInTheDocument()
  })
})
