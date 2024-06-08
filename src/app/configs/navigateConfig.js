import history from '@history';

export const navigateConfig = (redirectUrl) => {
    setTimeout(() => history.push('/apps/waiting'), 0);
    setTimeout(() => history.push(redirectUrl), 1);
}