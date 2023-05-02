import { useEffect } from 'react';
import moment from 'moment';

import ReactEcharts from 'echarts-for-react';

import { LOGGING } from '~/constants';

interface Props {
  chart: React.MutableRefObject<ReactEcharts>;
  container: React.MutableRefObject<HTMLElement>;
  fullscreen: boolean;
  setState: React.Dispatch<React.SetStateAction<ResizeState>>;
}

export interface ResizeState {
  dimensions?: DOMRect;
  availableHeight: number;
}

export const useResize = (
  { chart, container, fullscreen = false, setState }: Props = {} as Props
) => {
  const onChartClick = (e) => {
    const pos = chart.current
      .getEchartsInstance()
      .convertFromPixel({ seriesIndex: 1 }, [e.offsetX, e.offsetY]);
    LOGGING &&
      console.log(
        `==> clicked timestamp: ${moment(pos[0]).utc().toISOString()}`
      );
  };

  useEffect(() => {
    if (!chart.current) return;
    const echartsInstance = chart.current.getEchartsInstance();
    const zr = echartsInstance.getZr();
    zr.on('click', onChartClick);

    let timer = undefined;

    const resizeListener = () => {
      LOGGING && console.log('resize listener firing');

      clearTimeout(timer);

      timer = setTimeout(() => {
        if (container.current) {
          const dim = container.current.getBoundingClientRect();
          const newAvailableHeight = window.innerHeight - dim.top - 30; // arbitrary bottom padding

          // console.log('setting new available height to', newAvailableHeight)

          setState((state) => ({
            ...state,
            dimensions: dim,
            availableHeight: newAvailableHeight,
          }));
        }
      }, 100);
    };

    resizeListener();

    LOGGING && console.log('adding resizeListener');
    window.addEventListener('resize', resizeListener);

    return () => {
      LOGGING && console.log('removing resizeListener');
      clearTimeout(timer);

      window.removeEventListener('resize', resizeListener);
    };
  }, [fullscreen]);
};
