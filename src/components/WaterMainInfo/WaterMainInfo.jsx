import AddWaterBtn from './AddWaterBtn/AddWaterBtn';
import WaterDailyNorma from './WaterDailyNorma/WaterDailyNorma';
import WaterProgressBar from './WaterProgressBar/WaterProgressBar';

import css from './WaterMainInfo.module.css';

import { default as bottel1x } from '../../shared/images/trackerPage/bottel@x1.webp';
import { default as bottel2x } from '../../shared/images/trackerPage/bottel@x2.webp';
import Logo from '../../shared/components/Logo/Logo';

const WaterMainInfo = () => {
  return (
    <div
      data-aos="fade-right"
      data-aos-anchor="#example-anchor"
      data-aos-offset="500"
      data-aos-duration="500"
      className={css.container}
    >
      <Logo className={css.logoTracker} />
      <WaterDailyNorma />
      <WaterProgressBar />
      <AddWaterBtn />
      <div className={css.imageContainer}>
        <img
          className={css.image}
          src={bottel1x}
          srcSet={`${bottel1x} 1x, ${bottel2x} 2x`}
          alt="Water bottel image"
        />
      </div>
    </div>
  );
};

export default WaterMainInfo;
