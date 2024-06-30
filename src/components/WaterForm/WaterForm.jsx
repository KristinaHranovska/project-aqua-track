import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import style from './WaterForm.module.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { addWater, updateWaterAmount } from '../../redux/water/operation';
import { selectLoading, selectEntries } from '../../redux/water/selectors';
import { icons as sprite } from '../../shared/icons';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import Loader from '../../components/Loader/Loader';
import { useModalContext } from '../../context/useModalContext';

const schemaWater = yup.object().shape({
  waterAmount: yup
    .number()
    .required('Please enter the amount of water.')
    .min(0, 'The minimum allowed amount of water is 0 ml.')
    .max(500, 'The maximum allowed amount of water is 500 ml.'),
  time: yup.string().required('Please select recording time.'),
  keyboardAmount: yup
    .number()
    .required('Please enter the value of water used.')
    .min(0, 'The minimum allowed amount of water is 0 ml.')
    .max(500, 'The maximum allowed amount of water is 500 ml.'),
});

const WaterForm = ({ operationType, recordId }) => {
  //   console.log('Record ID:', recordId);
  const dispatch = useDispatch();
  const { closeModal } = useModalContext();
  const loading = useSelector(selectLoading);
  const entries = useSelector(selectEntries);

  const defaultTime = () => {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const {
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
    register,
  } = useForm({
    resolver: yupResolver(schemaWater),
    defaultValues: {
      waterAmount: 50,
      time: defaultTime(),
      keyboardAmount: 50,
    },
  });

  const mlToDecimal = (ml) => {
    return parseFloat((ml / 1000).toFixed(3));
  };

  const onSubmit = async (data) => {
    try {
      //   console.log('Received data:', data);
      //   console.log('Record ID:', recordId);
      await schemaWater.validate(data, { abortEarly: false });

      const [hours, minutes] = data.time.split(':');
      const newEntry = {
        amount: mlToDecimal(data.waterAmount),
        hours: parseInt(hours, 10),
        minutes: parseInt(minutes, 10),
      };

      //   console.log(newEntry.amount);

      if (operationType === 'add') {
        console.log(newEntry);
        dispatch(addWater(newEntry));
      } else if (operationType === 'edit' && recordId) {
        dispatch(
          updateWaterAmount({
            waterId: recordId,
            updatedAmount: data.waterAmount,
          })
        );
        closeModal();
        toast.success('Data successfully updated!');
      }
    } catch (error) {
      toast.error('Invalid value of water! Min: 0, Max: 500');
    } finally {
      closeModal();
    }
  };

  useEffect(() => {
    dispatch(updateWaterAmount());
  }, [dispatch, entries, recordId]);

  const handleWaterChange = (newValue) => {
    setValue('waterAmount', newValue);
    setValue('keyboardAmount', newValue);
  };

  const incrementWater = () => {
    const currentAmount = Number(getValues('waterAmount'));
    const newValue = currentAmount + 50;
    if (newValue <= 500) {
      handleWaterChange(newValue);
      setValue('waterAmount', newValue);
    }
  };

  const decrementWater = () => {
    const currentAmount = Number(getValues('waterAmount'));
    if (currentAmount >= 50) {
      const newValue = currentAmount - 50;
      handleWaterChange(newValue);
      setValue('waterAmount', newValue);
    }
  };

  const handleKeyboardAmountChange = (e) => {
    const newValue = Number(e.target.value);
    if (e.target.value.length <= 3 && newValue >= 0 && newValue <= 500) {
      handleWaterChange(newValue);
    }
  };

  return (
    <div>
      {loading && <Loader />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.addWaterForm}>
          <label className={style.itemWaterForm}>
            <span className={style.spanFormWater}>Amount of water:</span>
            <div className={style.waterAmountInputContainer}>
              <svg className={style.iconOperator} onClick={decrementWater}>
                <use
                  className={style.icon}
                  xlinkHref={`${sprite}#minus-modal`}
                />
              </svg>
              <div className={style.wrapperInput}>
                <input
                  className={style.inputAddWater}
                  type="number"
                  {...register('waterAmount', { required: true })}
                  value={getValues('waterAmount')}
                  readOnly
                />
                <span className={style.mlLabel}>ml</span>
              </div>
              <svg className={style.iconOperator} onClick={incrementWater}>
                <use
                  className={style.icon}
                  xlinkHref={`${sprite}#plus-modal`}
                />
              </svg>
            </div>
          </label>
          <p>{errors.waterAmount?.message}</p>
        </div>

        <div className={style.timeWaterForm}>
          <label>
            <span className={style.spanFormWater}>Recording time:</span>
            <input
              className={style.inputWaterForm}
              type="time"
              {...register('time', { required: true })}
              defaultValue={defaultTime()}
              onChange={(e) => setValue('time', e.target.value)}
            />
          </label>
          <p>{errors.time?.message}</p>
        </div>

        <div className={style.enterWaterForm}>
          <label>
            <span className={style.spanFormWater}>
              Enter the value of the water used:
            </span>
            <input
              className={style.inputWaterForm}
              type="number"
              {...register('keyboardAmount', { required: true })}
              onChange={handleKeyboardAmountChange}
            />
          </label>
          <p>{errors.keyboardAmount?.message}</p>
        </div>
        <button
          className={style.btnWaterForm}
          type="submit"
          disabled={!isValid}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default WaterForm;
