import { useNavigate } from 'react-router';
import { useMarathon } from '~/contexts/marathonContext';

export const useRedirectToAsset = () => {
  const { currentAsset, pinnedAsset } = useMarathon();
  const navigate = useNavigate();

  if (!currentAsset && pinnedAsset) {
    return navigate(pinnedAsset.url);
  }
};
