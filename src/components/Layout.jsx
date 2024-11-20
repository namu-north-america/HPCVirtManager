import { Topbar } from './Topbar';

export default function Layout({ children }) {
  return (
    <div>
      <Topbar />
      <main>{children}</main>
    </div>
  );
} 