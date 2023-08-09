import React from 'react';
import type { AppProps } from 'next/app';
import 'dayjs/locale/ko';
import dayjs from 'dayjs';

dayjs.locale('ko');

const App = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
};

export default App;
