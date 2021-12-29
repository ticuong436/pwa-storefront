import ReactGA from 'react-ga';

export const initGA = () => {
    if (process.env.SKY_GA_TRACKING_ID) {
        ReactGA.initialize(process.env.SKY_GA_TRACKING_ID);
    }
};
