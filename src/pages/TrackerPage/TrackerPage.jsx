import { Helmet } from 'react-helmet-async';
import WaterMainInfo from '../../components/WaterMainInfo/WaterMainInfo';
import WaterDetailedInfo from '../../components/WaterDetailedInfo/WaterDetailedInfo';
import style from './TrackerPage.module.css';
import Modals from '../../components/Modals/Modals';
import DeleteWaterModal from '../../components/Modals/DeleteWaterModal/DeleteWaterModal';

const TrackerPage = () => {
  return (
    <>
      <h2>TrackerPage</h2>
      <Helmet>
        <title>Tracker Page</title>
      </Helmet>
      <div className={style.wrapper}>
        <WaterMainInfo />
        <WaterDetailedInfo />
      </div>
      <div>
        <DeleteWaterModal />
      </div>
      <Modals />
    </>
  );
};

export default TrackerPage;
