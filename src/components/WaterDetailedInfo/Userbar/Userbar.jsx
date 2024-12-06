import { useEffect, useState } from 'react';
import css from './Userbar.module.css';
import { icons as sprite } from '../../../shared/icons/index';
import { useAuth } from '../../../hooks/useAut';
import LogOutModal from '../../Modals/LogOutModal/LogOutModal';
import { useModalContext } from '../../../context/useModalContext';
// import UserSettingsModal from '../../Modals/UserSettingsModal/UserSettingsModal';
import { useDispatch, useSelector } from 'react-redux';
import { refreshUser } from '../../../redux/auth/operation';
import { selectUser } from '../../../redux/auth/selectors';
import { useTranslation } from 'react-i18next';

const Userbar = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { openModal } = useModalContext();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUser);
  const [isUserUpdated, setIsUserUpdated] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(refreshUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isUserUpdated) {
      dispatch(refreshUser());
      setIsUserUpdated(false);
    }
  }, [dispatch, isUserUpdated]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getFirstName = (fullName) => {
    return fullName ? fullName.split(' ')[0] : t('Userbar.user');
  };

  return (
    <div className={css.userBarWrapper}>
      <h2 className={css.welcome}>
        {t('Userbar.hello')}
        <span className={css.name}>, {getFirstName(userInfo?.name)}!</span>
      </h2>
      <div className={css.userBarMenu} data-tour="step-7">
        <button className={css.userBarBtn} onClick={toggleMenu}>
          {getFirstName(userInfo?.name)}
          {userInfo?.avatar ? (
            <img
              src={userInfo.avatar}
              alt="User Avatar"
              className={css.avatar}
            />
          ) : (
            <span className={css.avatarPlaceholder}>.</span>
          )}
          <svg className={`${css.chevron} ${menuOpen ? css.open : ''}`}>
            <use xlinkHref={`${sprite}#arrow-down`} />
          </svg>
        </button>
        {menuOpen && (
          <div className={css.userBarOpenMenu}>
            <ul className={css.wrapperLink}>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className={css.userBarLink}
                  href="#settings"
                >
                  <svg width="16" height="16">
                    <use xlinkHref={`${sprite}#settings`} />
                  </svg>
                  {t('Userbar.setting')}
                </a>
              </li>
              <li>
                <a
                  className={css.userBarLink}
                  onClick={() => openModal(<LogOutModal />)}
                >
                  <svg width="16" height="16">
                    <use xlinkHref={`${sprite}#log-out`} />
                  </svg>
                  {t('Userbar.logOut')}
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Userbar;
