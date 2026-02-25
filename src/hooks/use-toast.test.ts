// @ts-ignore
import { describe, it, expect } from "bun:test";
import { reducer, type State, type ToasterToast } from "./use-toast";

describe("use-toast reducer", () => {
  const createToast = (id: string, title?: string): ToasterToast => ({
    id,
    title,
    description: "test description",
    variant: "default",
  });

  const initialState: State = { toasts: [] };

  describe("ADD_TOAST", () => {
    it("should add a new toast to the beginning of the list", () => {
      const toast = createToast("1", "Toast 1");
      const newState = reducer(initialState, { type: "ADD_TOAST", toast });

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(toast);
    });

    it("should limit the number of toasts to 3", () => {
      let state = initialState;
      const toast1 = createToast("1");
      const toast2 = createToast("2");
      const toast3 = createToast("3");
      const toast4 = createToast("4");

      state = reducer(state, { type: "ADD_TOAST", toast: toast1 });
      state = reducer(state, { type: "ADD_TOAST", toast: toast2 });
      state = reducer(state, { type: "ADD_TOAST", toast: toast3 });

      // Should have 3 items: [3, 2, 1]
      expect(state.toasts).toHaveLength(3);
      expect(state.toasts[0].id).toBe("3");
      expect(state.toasts[2].id).toBe("1");

      // Add 4th item
      state = reducer(state, { type: "ADD_TOAST", toast: toast4 });

      // Should still have 3 items: [4, 3, 2]. Item 1 should be removed.
      expect(state.toasts).toHaveLength(3);
      expect(state.toasts[0].id).toBe("4");
      expect(state.toasts[1].id).toBe("3");
      expect(state.toasts[2].id).toBe("2");
      expect(state.toasts.find((t) => t.id === "1")).toBeUndefined();
    });
  });

  describe("UPDATE_TOAST", () => {
    it("should update an existing toast", () => {
      const toast = createToast("1", "Original Title");
      const stateWithToast = { toasts: [toast] };

      const newState = reducer(stateWithToast, {
        type: "UPDATE_TOAST",
        toast: { id: "1", title: "Updated Title" },
      });

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].title).toBe("Updated Title");
      expect(newState.toasts[0].description).toBe("test description"); // Should preserve other fields
    });

    it("should not modify state if toast id does not exist", () => {
      const toast = createToast("1", "Original Title");
      const stateWithToast = { toasts: [toast] };

      const newState = reducer(stateWithToast, {
        type: "UPDATE_TOAST",
        toast: { id: "999", title: "Updated Title" },
      });

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0]).toEqual(toast);
    });
  });

  describe("REMOVE_TOAST", () => {
    it("should remove a toast by id", () => {
      const toast1 = createToast("1");
      const toast2 = createToast("2");
      const state = { toasts: [toast1, toast2] };

      const newState = reducer(state, { type: "REMOVE_TOAST", toastId: "1" });

      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe("2");
    });

    it("should clear all toasts if toastId is undefined", () => {
      const toast1 = createToast("1");
      const toast2 = createToast("2");
      const state = { toasts: [toast1, toast2] };

      const newState = reducer(state, { type: "REMOVE_TOAST", toastId: undefined });

      expect(newState.toasts).toHaveLength(0);
    });

    it("should do nothing if removing non-existent id", () => {
       const toast1 = createToast("1");
       const state = { toasts: [toast1] };

       const newState = reducer(state, { type: "REMOVE_TOAST", toastId: "999" });

       expect(newState.toasts).toHaveLength(1);
       expect(newState.toasts[0]).toEqual(toast1);
    });
  });

  describe("DISMISS_TOAST", () => {
    it("should return the state object", () => {
      const toast1 = createToast("1");
      const state = { toasts: [toast1] };

      // Note: DISMISS_TOAST has a side effect (addToRemoveQueue) which sets a timeout.
      // In this unit test of the reducer pure function, we verify the return value.
      const newState = reducer(state, { type: "DISMISS_TOAST", toastId: "1" });

      expect(newState).toBe(state);
    });

    it("should return state object when dismissing all", () => {
        const toast1 = createToast("1");
        const state = { toasts: [toast1] };

        const newState = reducer(state, { type: "DISMISS_TOAST", toastId: undefined });
        expect(newState).toBe(state);
    });
  });
});
