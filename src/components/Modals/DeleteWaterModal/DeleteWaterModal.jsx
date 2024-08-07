import { useModalContext } from '../../../context/useModalContext';
import css from './DeleteWaterModal.module.css';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectMonth, selectDate } from '../../../redux/water/selectors';
import {
  apiDeleteWater,
  apiGetWaterMonth,
  apiGetWaterDay,
} from '../../../redux/water/operation';
import { useTranslation } from 'react-i18next';

const DeleteWaterModal = ({ onDelete }) => {
  const { t } = useTranslation();
  const { closeModal } = useModalContext();
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectDate);
  const currentMonth = useSelector(selectMonth);

  const handleDelete = async () => {
    try {
      await dispatch(apiDeleteWater(onDelete));
      closeModal();
      toast.success(t('modals.delete.success'));

      dispatch(apiGetWaterDay(selectedDate));

      if (
        Number(selectedDate.split('-')[0]) === currentMonth.year &&
        Number(selectedDate.split('-')[1]) === currentMonth.month
      ) {
        dispatch(apiGetWaterMonth(currentMonth));
      }
    } catch (error) {
      toast.error(t('modals.delete.error'));
    }
  };

  return (
    <div className={css.deleteModalBackground}>
      <h2 className={css.title}>{t('modals.delete.title')}</h2>
      <p className={css.paragraf}>{t('modals.delete.text')}</p>
      <div className={css.buttons}>
        <button
          className={css.buttondelete}
          onClick={handleDelete}
          type="button"
        >
          {t('modals.delete.delete')}
        </button>
        <button className={css.buttoncancel} onClick={closeModal} type="button">
          {t('modals.delete.cancel')}
        </button>
      </div>
    </div>
  );
};

export default DeleteWaterModal;
