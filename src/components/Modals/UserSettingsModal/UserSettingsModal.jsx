import { useModalContext } from '../../../context/useModalContext';
import css from './UserSettingsModal.module.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { icons as sprite } from '../../../shared/icons/index';
import Loader from '../../Loader/Loader';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatRegex, isValidLatinInput } from '../../../helpers/constants';

const UserSettingsModal = ({ setIsUserUpdated }) => {
  const { closeModal } = useModalContext();
  const [userData, setUserData] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [amount, setAmount] = useState(0);
  const [weight, setWeight] = useState(0);
  const [time, setTime] = useState(0);
  const [gender, setGender] = useState('');
  const [name, setName] = useState(' ');
  const [email, setEmail] = useState(' ');
  const [loading, setLoading] = useState(true);
  const [newData, setNewData] = useState({});
  const [willDrink, setWillDrink] = useState();
  const [newErrors, setNewErrors] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/users/profile');
        const result = response;
        setUserData(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (weight && gender) {
      let newAmount;
      if (gender === 'man') {
        newAmount = weight * 0.04 + time * 0.6;
      }
      if (gender === 'woman') {
        newAmount = weight * 0.03 + time * 0.4;
      }
      setAmount((Math.ceil(newAmount * 10) / 10).toFixed(1));
    }
  }, [setAmount, gender, time, weight]);

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    event.preventDefault();
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleChange = (event) => {
    if (event.target.files) {
      const fileUploaded = event.target.files[0];
      setAvatarFile(fileUploaded);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorsObject = {};

    if (!email || !formatRegex.test(email)) {
      errorsObject.email = true;
      toast.error('Please enter a valid email address');
    }

    if (!name || !isValidLatinInput.test(name)) {
      errorsObject.name = true;
      toast.error('Please enter a valid name using Latin characters');
    }

    if (!weight && weight !== 0) {
      errorsObject.weight = true;
      toast.error('Weight is required');
    }

    if (!time && time !== 0) {
      errorsObject.time = true;
      toast.error('Active time is required');
    }

    if (!willDrink && willDrink !== 0) {
      errorsObject.water = true;
      toast.error('Amount of water to drink is required');
    }

    setNewErrors(errorsObject);

    if (Object.keys(errorsObject).length > 0) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newData.name);
      formData.append('avatar', newData.avatar);
      formData.append('dailyActivityTime', newData.dailyActivityTime);
      formData.append('dailyWaterNorm', newData.dailyWaterNorm);
      formData.append('email', newData.email);
      formData.append('gender', newData.gender);
      formData.append('weight', newData.weight);

      await axios.patch('/users/update', formData);

      setIsUserUpdated(true);
      toast.success('Your data has been updated successfully');
    } catch (error) {
      console.log(error);
    }
    closeModal();
  };

  useMemo(() => {
    if (userData) {
      setNewData({
        avatar: avatarFile ? avatarFile : userData.avatar,
        dailyActivityTime: time,
        dailyWaterNorm: willDrink ? willDrink : amount,
        email: email,
        gender: gender,
        name: name,
        weight: weight,
      });
    }
  }, [
    userData,
    avatarFile,
    time,
    amount,
    email,
    gender,
    name,
    weight,
    willDrink,
  ]);

  useMemo(() => {
    if (userData) {
      setGender(userData.gender);
      setAmount(userData.dailyWaterNorm);
      setWillDrink(userData.dailyWaterNorm);
      setTime(userData.dailyActivityTime ? userData.dailyActivityTime : '0');
      setEmail(userData.email);
      setName(userData.name);
      setWeight(userData.weight);
    }
  }, [userData]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  } else {
    return (
      <div className={css.wrapper}>
        <form onSubmit={undefined} className={css.form}>
          <div className={css.userPic}>
            <h2>Setting</h2>
            <div className={css.picWrapper}>
              <div className={css.pic}>
                <img
                  className={css.avatar}
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : userData.avatar
                  }
                  alt="avatar"
                />
              </div>
              <div className={css.uploadWrapper} onClick={handleClick}>
                <svg className={css.iconUpload}>
                  <use xlinkHref={`${sprite}#upload`} />
                </svg>
                <p className={css.textRegular}>Upload a photo</p>
              </div>
              <input
                type="file"
                onChange={handleChange}
                ref={hiddenFileInput}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className={css.inputs}>
            <div className={css.wrapperInputsForm}>
              <div className={css.midContainer}>
                <h3>Your gender identity</h3>
                <div className={css.radioContainer}>
                  <div className={css.radioButton}>
                    <input
                      className={css.radio}
                      type="radio"
                      name="gender"
                      id="woman"
                      value="woman"
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                      checked={
                        gender === 'woman' || userData.gender === 'woman'
                      }
                    />
                    <label className={css.radioLabel} htmlFor="woman">
                      Woman
                    </label>
                  </div>
                  <div className={css.radioButton}>
                    <input
                      className={css.radio}
                      type="radio"
                      name="gender"
                      id="man"
                      value="man"
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                      checked={gender === 'man' || userData.gender === 'man'}
                    />
                    <label className={css.radioLabel} htmlFor="man">
                      Man
                    </label>
                  </div>
                </div>
              </div>
              <div className={css.midContainer}>
                <div className={css.userInfoInputContainer}>
                  <h3>Your name</h3>
                  <input
                    className={`${css.userInfoInput} ${newErrors.name ? css.error : ''}`}
                    type="text"
                    name="name"
                    id="name"
                    value={name === ' ' ? userData.name : name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  {newErrors.name && (
                    <span className={css.errorSpan}>
                      Please enter a valid name using Latin characters
                    </span>
                  )}
                </div>
                <div className={css.userInfoInputContainer}>
                  <h3>Email</h3>
                  <input
                    className={`${css.userInfoInput} ${newErrors.email ? css.error : ''}`}
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  {newErrors.email && (
                    <span className={css.errorSpan}>
                      Please enter a valid email address
                    </span>
                  )}
                </div>
              </div>
              <div className={css.midContainer}>
                <h3>My daily norma</h3>
                <div className={css.formulaContainer}>
                  <div className={css.formula}>
                    <p className={css.textRegular}>For woman:</p>
                    <p className={css.textAccent}>V=(M*0,03) + (T*0,4)</p>
                  </div>
                  <div className={css.formula}>
                    <p className={css.textRegular}>For man:</p>
                    <p className={css.textAccent}>V=(M*0,04) + (T*0,6)</p>
                  </div>
                </div>
                <div className={css.textarea} readOnly>
                  <span className={css.textAccent}>*</span> V is the volume of
                  the water norm in liters per day, M is your body weight, T is
                  the time of active sports, or another type of activity
                  commensurate in terms of loads (in the absence of these, you
                  must set 0)
                </div>
                <div className={css.note}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M7.57934 10.4315C7.64769 11.1434 7.76356 11.6724 7.92303 12.0214C8.08447 12.3693 8.37106 12.5429 8.78478 12.5429C8.86212 12.5429 8.93131 12.5308 8.99994 12.5167C9.07025 12.5308 9.13916 12.5429 9.21706 12.5429C9.62966 12.5429 9.91709 12.3693 10.0777 12.0214C10.238 11.6724 10.3519 11.1434 10.4217 10.4315L10.789 4.93532C10.8573 3.86404 10.8922 3.09538 10.8922 2.62879C10.8922 1.99372 10.7265 1.49816 10.3941 1.14238C10.0605 0.7866 9.62234 0.609131 9.07953 0.609131C9.05056 0.609131 9.02891 0.6156 9.0005 0.616725C8.9735 0.6156 8.95128 0.609131 8.92316 0.609131C8.37922 0.609131 7.94187 0.7866 7.60887 1.14238C7.27616 1.49872 7.10938 1.99457 7.10938 2.62907C7.10938 3.09566 7.14341 3.86432 7.21287 4.9356L7.57934 10.4315ZM9.01428 14.5518C8.48722 14.5518 8.03947 14.718 7.66766 15.0505C7.29612 15.3832 7.10994 15.7871 7.10994 16.2613C7.10994 16.7965 7.29837 17.2178 7.67244 17.5238C8.04819 17.8298 8.48637 17.9828 8.98728 17.9828C9.49719 17.9828 9.94184 17.832 10.3221 17.5297C10.7018 17.2282 10.8916 16.8046 10.8916 16.2618C10.8916 15.7876 10.7099 15.3838 10.3466 15.051C9.98319 14.718 9.53909 14.5518 9.01344 14.5518"
                      fill="#9BE1A0"
                    />
                  </svg>
                  <p className={css.textRegular}>Active time in hours</p>
                </div>
              </div>
            </div>

            <div className={css.wrapperInputsForm}>
              <div className={css.midContainer}>
                <div className={`${css.userInfoInputContainer} ${css.down}`}>
                  <p className={css.textRegular}>Your weight in kilograms:</p>
                  <input
                    className={`${css.userInfoInput} ${newErrors.weight ? css.error : ''}`}
                    type="number"
                    name="weight"
                    id="weight"
                    step=".1"
                    onChange={(e) => {
                      setWeight(e.target.value);
                    }}
                    value={weight}
                  />
                  {newErrors.weight && (
                    <span className={css.errorSpan}>Weight is required</span>
                  )}
                </div>
                <div className={css.userInfoInputContainer}>
                  <p className={css.textRegular}>
                    The time of active participation in sports:
                  </p>
                  <input
                    className={`${css.userInfoInput} ${newErrors.time ? css.error : ''}`}
                    type="number"
                    name="time"
                    id="time"
                    step=".1"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                    }}
                  />
                  {newErrors.time && (
                    <span className={css.errorSpan}>
                      Active time is required
                    </span>
                  )}
                </div>
              </div>
              <div className={css.midContainer}>
                <div className={`${css.userInfoInputContainer} ${css.amount}`}>
                  <p className={css.textRegular}>
                    The required amount of water in liters per day:
                  </p>
                  <p
                    className={css.textAccent}
                  >{`${amount ? amount : userData.dailyWaterNorm} L`}</p>
                </div>
              </div>
              <div className={css.userInfoInputContainer}>
                <h3>Write down how much water you will drink:</h3>
                <input
                  className={`${css.userInfoInput} ${newErrors.water ? css.error : ''}`}
                  type="number"
                  name="water"
                  id="water"
                  step=".1"
                  value={willDrink}
                  onChange={(e) => {
                    setWillDrink(e.target.value);
                  }}
                />
                {newErrors.water && (
                  <span className={css.errorSpan}>
                    Amount of water to drink is required
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={css.buttonContainer}>
            <button
              className={css.saveButton}
              type="submit"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
};
export default UserSettingsModal;
