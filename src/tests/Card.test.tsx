import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/Card';
import { describe, it, expect } from 'vitest';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>);
  expect(screen.getByText('Content')).toBeTruthy();
  });
});
