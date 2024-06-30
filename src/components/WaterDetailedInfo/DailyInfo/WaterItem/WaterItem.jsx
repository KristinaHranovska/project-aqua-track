import { useModalContext } from '../../../../context/useModalContext.jsx';
import { icons as sprite } from '../../../../shared/icons/index.js';
import WaterModal from '../../../WaterModal/WaterModal.jsx';

import css from './WaterItem.module.css';

function WaterItem({ data }) {
  const { openModal } = useModalContext();

  const { id, amount, time, date } = data;

  const formatAmount = (amount) => {
    const mlAmount = amount * 1000;
    return `${mlAmount}\u00A0ml`;
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={css.item} id={id}>
      <svg className={css.svg_glass}>
        <use xlinkHref={`${sprite}#water-glass`} />
      </svg>
      <div className={css.info}>
        <p className={css.info_ml}>{formatAmount(amount)}</p>
        <p className={css.info_time}>{formatTime(time? time : date)} AM</p>
      </div>
      <div className={css.btns}>
        <button
          className={css.btn}
          onClick={() => {
            openModal(<WaterModal />);
          }}
        >
          <svg className={css.svg_edit}>
            <use xlinkHref={`${sprite}#edit`} />
          </svg>
        </button>
        <button className={css.btn}>
          <svg className={css.svg_trash}>
            <use xlinkHref={`${sprite}#trash`} />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default WaterItem;
