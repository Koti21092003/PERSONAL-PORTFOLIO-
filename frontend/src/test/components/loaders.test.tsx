import { render, screen } from "@testing-library/react";
import UiverseLoader from "../../components/UiverseLoader";
import Loader from "../../components/Loader";

describe("Loaders", () => {
  it("renders a custom label and three animation rings", () => {
    render(<UiverseLoader label="Booting..." />);
    expect(screen.getByText("Booting...")).toBeInTheDocument();
    expect(document.querySelectorAll(".uiverse-load-inner")).toHaveLength(3);
  });

  it("defaults to 'Loading...' through the Loader wrapper", () => {
    render(<Loader />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
