import React from 'react';
import { render, screen } from '@testing-library/react';
import { MasonryGrid } from '@/components/ui/MasonryGrid';
import { describe, it, expect } from 'vitest';

describe('MasonryGrid', () => {
  it('renders children in css column mode', () => {
    render(
      <MasonryGrid columnMode="css">
        <div>One</div>
        <div>Two</div>
      </MasonryGrid>
    );
  expect(screen.getByText('One')).toBeTruthy();
  expect(screen.getByText('Two')).toBeTruthy();
  });
});
