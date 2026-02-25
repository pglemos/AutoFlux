import { describe, it, expect } from 'bun:test'
import { cn } from './utils'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
  })

  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  it('should handle arrays and objects', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2')
    expect(cn({ class1: true, class2: false })).toBe('class1')
    expect(cn([{ class1: true }, 'class2'])).toBe('class1 class2')
  })

  it('should handle complex combinations', () => {
    expect(cn('base-class', [
      'conditional',
      { 'active': true, 'disabled': false }
    ], 'extra')).toBe('base-class conditional active extra')
  })

  it('should handle undefined and null values', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
  })
})
