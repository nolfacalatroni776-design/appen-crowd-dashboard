/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Layout from './components/Layout';
import { DashboardProvider } from './context/DashboardContext';

export default function App() {
  return (
    <DashboardProvider>
      <Layout />
    </DashboardProvider>
  );
}

