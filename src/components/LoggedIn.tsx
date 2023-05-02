import { Route, Routes } from 'react-router';
import React from 'react';
import { useMarathon } from '~/contexts/marathonContext';
import { Loading } from './loading';
import { AssetTypes } from './pages/assetTypes';
import { Users } from './pages/users';
import { Groups } from './pages/groups';
import { GraphTypes } from './pages/graphs';
import { Events } from './pages/events';
import { Investigations } from './pages/investigations';

export const MainContent = () => {
  const { loading } = useMarathon();

  if (loading.anything) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/assetTypes/:idOrSlug" element={<AssetTypes />} />
      <Route path="/assetTypes/*" element={<AssetTypes />} />
      <Route path="/investigations/*" element={<Investigations />} />
      <Route path="/graphs/*" element={<GraphTypes />} />
      <Route path="/users/*" element={<Users />} />
      <Route path="/Events/*" element={<Events />} />
      <Route path="/users/users" element={<Users />} />
      <Route path="/users/groups" element={<Groups />} />
      <Route path="*" element={<AssetTypes />} />
    </Routes>
  );
};
