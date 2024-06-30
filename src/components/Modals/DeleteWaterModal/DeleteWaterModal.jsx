import { useModalContext } from '../../../context/useModalContext';
import css from './DeleteWaterModal.module.css';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { apiDeleteWater } from '../../../redux/water/operation';

const DeleteWaterModal = ({ onDelete }) => {
  const { closeModal } = useModalContext();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(apiDeleteWater(onDelete));
      closeModal();
      toast.success('Entry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete the entry.');
    }
  };

  return (
    <div className={css.deleteModalBackground}>
      <h2 className={css.title}>Delete entry</h2>
      <p className={css.paragraf}>Are you sure you want to delete the entry?</p>
      <div className={css.buttons}>
        <button
          className={css.buttondelete}
          onClick={handleDelete}
          type="button"
        >
          Delete
        </button>
        <button className={css.buttoncancel} onClick={closeModal} type="button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteWaterModal;