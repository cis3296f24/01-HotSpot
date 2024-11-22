import React from 'react'; // Import React for JSX compatibility
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import NavBar from './NavBar';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('NavBar Component', () => {
  it('renders navigation buttons', () => {
    render(<NavBar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Hotspots')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('toggles the notifications dropdown', () => {
    render(<NavBar />);

    const notificationsButton = screen.getByText('Notifications');
    fireEvent.click(notificationsButton);
    expect(screen.getByText('Alerts')).toBeInTheDocument();

    fireEvent.click(notificationsButton);
    expect(screen.queryByText('Alerts')).not.toBeInTheDocument();
  });
});
