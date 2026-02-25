
import { test, expect, describe } from "bun:test";
import { reducer } from "./use-toast";

describe("Toast Reducer", () => {
    const mockState = {
        toasts: [
            { id: '1', title: 'Toast 1' },
            { id: '2', title: 'Toast 2' },
        ]
    };

    describe("ADD_TOAST", () => {
        test("should add a toast to the beginning", () => {
            const state = reducer({ toasts: [] }, { type: 'ADD_TOAST', toast: { id: '1', title: 'T1' } });
            expect(state.toasts).toHaveLength(1);
            expect(state.toasts[0].id).toBe('1');
        });

        test("should respect TOAST_LIMIT", () => {
            let state = { toasts: [
                { id: '3', title: 'T3' },
                { id: '2', title: 'T2' },
                { id: '1', title: 'T1' },
            ] };
            state = reducer(state, { type: 'ADD_TOAST', toast: { id: '4', title: 'T4' } });
            expect(state.toasts).toHaveLength(3);
            expect(state.toasts[0].id).toBe('4');
            expect(state.toasts[2].id).toBe('2'); // T1 was the oldest and should be removed
        });
    });

    describe("UPDATE_TOAST", () => {
        test("should update an existing toast", () => {
            const state = reducer(mockState, {
                type: 'UPDATE_TOAST',
                toast: { id: '1', title: 'Updated' }
            });
            expect(state.toasts[0].title).toBe('Updated');
            expect(state.toasts[1].title).toBe('Toast 2');
            expect(state.toasts).not.toBe(mockState.toasts);
        });

        test("should return original state if toast does not exist", () => {
            const state = reducer(mockState, {
                type: 'UPDATE_TOAST',
                toast: { id: 'non-existent', title: 'Updated' }
            });
            expect(state).toBe(mockState);
        });
    });

    describe("DISMISS_TOAST", () => {
        test("should return original state if toast does not exist", () => {
            const state = reducer(mockState, { type: 'DISMISS_TOAST', toastId: 'non-existent' });
            expect(state).toBe(mockState);
        });

        test("should return original state when dismissing existing toast (side effect only)", () => {
            const state = reducer(mockState, { type: 'DISMISS_TOAST', toastId: '1' });
            expect(state).toBe(mockState);
        });

        test("should return original state when dismissing all toasts (side effect only)", () => {
            const state = reducer(mockState, { type: 'DISMISS_TOAST' });
            expect(state).toBe(mockState);
        });
    });

    describe("REMOVE_TOAST", () => {
        test("should remove toast by ID", () => {
            const state = reducer(mockState, { type: 'REMOVE_TOAST', toastId: '1' });
            expect(state.toasts).toHaveLength(1);
            expect(state.toasts[0].id).toBe('2');
        });

        test("should clear all toasts if toastId is undefined", () => {
            const state = reducer(mockState, { type: 'REMOVE_TOAST' });
            expect(state.toasts).toHaveLength(0);
        });

        test("should return original state if toastId does not exist", () => {
            const state = reducer(mockState, { type: 'REMOVE_TOAST', toastId: 'non-existent' });
            expect(state).toBe(mockState);
        });

        test("should return original state if toastId is undefined and toasts is already empty", () => {
            const emptyState = { toasts: [] };
            const state = reducer(emptyState, { type: 'REMOVE_TOAST' });
            expect(state).toBe(emptyState);
        });
    });
});
