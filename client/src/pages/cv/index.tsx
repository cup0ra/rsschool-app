import * as React from 'react';
import { Layout, Typography } from 'antd';
import { NextRouter, withRouter } from 'next/router';
import withSession, { Session } from 'components/withSession';
import { LoadingScreen } from 'components/LoadingScreen';

const { Content } = Layout;
const { Title } = Typography;

type Props = {
  router: NextRouter;
  session: Session;
};

type State = {
  isLoading: boolean;
};

class CVPage extends React.Component<Props, State> {
  state: State = {
    isLoading: false
  };

render() {

  const {router} = this.props;

  const githubId = router.query ? (router.query.githubId as string) : undefined;

  return (
    <>
      <LoadingScreen show={this.state.isLoading}>
        <Layout style={{textAlign: "center"}}>
          <Content>
            <Title>CV of {githubId}</Title>
          </Content>
        </Layout>
      </LoadingScreen>
    </>
  );
}
}

export default withRouter(withSession(CVPage));
