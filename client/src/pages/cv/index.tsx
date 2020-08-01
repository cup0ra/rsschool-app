import * as React from 'react';
import { Layout, Typography } from 'antd';
import { NextRouter, withRouter } from 'next/router';
import withSession, { Session } from 'components/withSession';
import { LoadingScreen } from 'components/LoadingScreen';
import { UserService } from 'services/user';
import {
  Contacts,
  EmploymentRecord,
  CoursesStats,
  PublicFeedback,
  CoreCVInfo
} from '../../../../common/models/cv';

const { Content } = Layout;
const { Title } = Typography;

type Props = {
  router: NextRouter;
  session: Session;
};

type State = {
  isLoading: boolean;
  coreInfo: CoreCVInfo | null;
  contacts: Contacts | null;
  badges: PublicFeedback[] | null;
  educationHistory: any | null;
  employmentHistory: EmploymentRecord[] | null;
  coursesStats: CoursesStats[] | null;
};

class CVPage extends React.Component<Props, State> {
  state: State = {
    isLoading: false,
    coreInfo: null,
    contacts: null,
    badges: null,
    educationHistory: null,
    employmentHistory: null,
    coursesStats: null,
  };

  private async getData() {
    await this.setState({ isLoading: true });
    const { router } = this.props;

    try {
      const githubId = router.query ? (router.query.githubId as string) : undefined;
      const profile = await this.userService.getProfileInfo(githubId);
/*       const {
        contacts,
        generalInfo: {
          aboutMyself: about,
          educationHistory,
          englishLevel,
          githubId: github,
          location,
          name
        }
      } = profile; */
      console.log(profile);

  } catch(e) {
    await this.setState({
      isLoading: false,
      coreInfo: null,
      contacts: null,
      badges: null,
      educationHistory: null,
      employmentHistory: null,
      coursesStats: null,
    });
  }
}

  private userService = new UserService();

  async componentDidMount() {
    await this.getData();
  }

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
