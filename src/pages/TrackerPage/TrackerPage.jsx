import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WaterMainInfo from '../../components/WaterMainInfo/WaterMainInfo';
import WaterDetailedInfo from '../../components/WaterDetailedInfo/WaterDetailedInfo';
import Modals from '../../components/Modals/Modals';
import Container from '../../shared/components/Container/Container';
import { useTour } from '@reactour/tour';
import Languages from '../../shared/components/Languages/Languages';
import style from './TrackerPage.module.css';
import { icons as sprite } from '../../shared/icons';

const FeedbackForm = () => {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', feedback);
    setFeedback({ name: '', email: '', message: '' });
  };

  return (
    <div className={style.feedbackSection}>
      <h2 className={style.feedbackTitle}>
        {t('feedback.title', 'Give us Feedback')}
      </h2>
      <form onSubmit={handleSubmit} className={style.feedbackForm}>
        <div className={style.formGroup}>
          <label htmlFor="name">{t('feedback.name', 'Name')}</label>
          <input
            type="text"
            id="name"
            value={feedback.name}
            onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
            required
            className={style.formInput}
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="email">{t('feedback.email', 'Email')}</label>
          <input
            type="email"
            id="email"
            value={feedback.email}
            onChange={(e) =>
              setFeedback({ ...feedback, email: e.target.value })
            }
            required
            className={style.formInput}
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="message">
            {t('feedback.message', 'Your Feedback')}
          </label>
          <textarea
            id="message"
            value={feedback.message}
            onChange={(e) =>
              setFeedback({ ...feedback, message: e.target.value })
            }
            required
            className={style.formTextarea}
          />
        </div>
        <button type="submit" className={style.submitButton}>
          {t('feedback.submit', 'Submit Feedback')}
        </button>
      </form>
    </div>
  );
};

const TrackerPage = () => {
  const { t } = useTranslation();
  const { setIsOpen } = useTour();

  useEffect(() => {
    const isFirstVisit = localStorage.getItem('firstVisit') === null;
    if (isFirstVisit) {
      localStorage.setItem('firstVisit', 'false');
      setIsOpen(true);
    }
  });

  return (
    <>
      <Helmet>
        <title>{t('page.tracker')}</title>
      </Helmet>
      <Container>
        <div className={style.wrapperStyle}>
          <div className={style.wrapperElement}>
            <button className={style.btnInfo} onClick={() => setIsOpen(true)}>
              <svg
                width="18"
                height="18"
                aria-label="Tour in web"
                className={style.iconInfo}
              >
                <use xlinkHref={`${sprite}#icon-info`}></use>
              </svg>
            </button>
            <Languages />
          </div>
          <div className={style.wrapperTracker} data-tour="step-1">
            <WaterMainInfo />
            <WaterDetailedInfo />
          </div>
          <FeedbackForm />
        </div>
      </Container>
      <Modals />
    </>
  );
};

export default TrackerPage;
