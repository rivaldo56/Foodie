import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeTruthy();
  });
});
