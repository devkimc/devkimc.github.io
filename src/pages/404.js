import React from 'react';

import Layout from '../layout';
import Seo from '../components/seo';

function NotFoundPage() {
  return (
    <Layout>
      <Seo title="김씨의 개발일지" />
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  );
}

export default NotFoundPage;
