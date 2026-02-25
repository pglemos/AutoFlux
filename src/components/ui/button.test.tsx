/// <reference types="@testing-library/jest-dom" />
import { describe, test, expect, jest, afterEach } from "bun:test";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Button } from "./button";

afterEach(() => {
    cleanup();
});

describe("Button Component", () => {
    test("renders correctly with default props", () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole("button", { name: /click me/i });
        expect(button).toBeInTheDocument();
        // Check for default variant class (bg-primary)
        expect(button.className).toContain("bg-primary");
    });

    test("applies variant classes correctly", () => {
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByRole("button", { name: /delete/i });
        expect(button).toBeInTheDocument();
        expect(button.className).toContain("bg-destructive");
    });

    test("applies size classes correctly", () => {
        render(<Button size="sm">Small</Button>);
        const button = screen.getByRole("button", { name: /small/i });
        expect(button.className).toContain("h-8");
        expect(button.className).toContain("text-xs");
    });

    test("handles click events", () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        const button = screen.getByRole("button", { name: /click me/i });
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("renders as a child component when asChild is true", () => {
        render(
            <Button asChild>
                <a href="/link">Link Button</a>
            </Button>
        );
        // Should render an anchor tag, not a button
        const link = screen.getByRole("link", { name: /link button/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/link");
        // Should still have button classes
        expect(link.className).toContain("inline-flex");
    });

    test("can be disabled", () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole("button", { name: /disabled/i });
        expect(button).toBeDisabled();
    });
});
