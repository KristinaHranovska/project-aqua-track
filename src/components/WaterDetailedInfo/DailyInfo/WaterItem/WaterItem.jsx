import { useModalContext } from '../../../../context/useModalContext.jsx';
import { icons as sprite } from '../../../../shared/icons/index.js';
import WaterModal from '../../../WaterModal/WaterModal.jsx';
import DeleteWaterModal from '../../../Modals/DeleteWaterModal/DeleteWaterModal.jsx';

import css from './WaterItem.module.css';

function WaterItem({ data }) {
  const { openModal } = useModalContext();

  const { _id: id, amount, date } = data;

  const formatAmount = (amount) => {
    const mlAmount = amount * 1000;
    return `${mlAmount} ml`;
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, '0');
    return `${strHours}:${minutes} ${ampm}`;
  };

  return (
    <div className={css.item} id={id}>
      <svg className={css.svg_glass}>
        <use xlinkHref={`${sprite}#water-glass`} />
      </svg>
      <div className={css.info}>
        <p className={css.info_ml}>{formatAmount(amount)}</p>
        <p className={css.info_time}>{formatTime(date)}</p>
      </div>
      <div className={css.btns}>
        <button
          className={css.btn}
          onClick={() => {
            openModal(
              <WaterModal
                operationType={'edit'}
                recordId={id}
                initialData={{ amount, date }}
              />
            );
          }}
        >
          <svg className={css.svg_edit}>
            <use xlinkHref={`${sprite}#edit`} />
          </svg>
        </button>
        <button
          className={css.btn}
          onClick={() => {
            openModal(<DeleteWaterModal onDelete={id} />);
          }}
        >
          <svg className={css.svg_trash}>
            <use xlinkHref={`${sprite}#trash`} />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default WaterItem;
