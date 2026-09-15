import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "./auth";

function Probe() {
  const { isAuthenticated, login, logout, user } = useAuth();
  return (
    <div>
      <span data-ocid="auth-state">
        {isAuthenticated ? user?.email : "anonymous"}
      </span>
      <button
        type="button"
        onClick={() => login("admin@nonprofit.org", "admin123")}
      >
        login-ok
      </button>
      <button
        type="button"
        onClick={() => login("admin@nonprofit.org", "wrong")}
      >
        login-bad
      </button>
      <button type="button" onClick={logout}>
        logout
      </button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts unauthenticated", () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    expect(screen.getByTestId("auth-state")).toHaveTextContent("anonymous");
  });

  it("authenticates with valid credentials and logs out", () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    fireEvent.click(screen.getByText("login-ok"));
    expect(screen.getByTestId("auth-state")).toHaveTextContent(
      "admin@nonprofit.org",
    );

    fireEvent.click(screen.getByText("logout"));
    expect(screen.getByTestId("auth-state")).toHaveTextContent("anonymous");
  });

  it("rejects invalid credentials", () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    );
    fireEvent.click(screen.getByText("login-bad"));
    expect(screen.getByTestId("auth-state")).toHaveTextContent("anonymous");
  });
});
