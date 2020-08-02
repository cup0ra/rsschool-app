import * as React from 'react';
import { Layout } from 'antd';
import { NextRouter, withRouter } from 'next/router';
import withSession, { Session } from 'components/withSession';
import { LoadingScreen } from 'components/LoadingScreen';
import { UserService } from 'services/user';
import {
  Contacts,
  EmploymentRecord,
  EducationRecord,
  CoursesStats,
  PublicFeedback,
  CoreCVInfo,
} from '../../../../common/models/cv';
import CV from 'react-cv';

const { Content } = Layout;

const mockOpportunitiesData = {
  selfIntroLink: 'htpps://linktoselfintro.com',
  cvLink: 'htpps://linktocv.com',
  militaryService: 'served',
  employmentHistory: [
    {
      placeOfWork: 'Job1',
      position: 'Middle frontend developer',
      startDate: '2018-10',
      finishDate: '2019-10',
    },
    {
      placeOfWork: 'Job2',
      position: 'Senior frontend developer',
      startDate: '2019-10',
      finishDate: 'currently',
    },
  ],
};

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

      const generalInfo = profile?.generalInfo;
      const contacts = profile?.contacts ? profile.contacts : null;
      const studentStats = profile?.studentStats ? profile.studentStats : null;
      const publicFeedback = profile?.publicFeedback ? profile.publicFeedback : null;

      const about = generalInfo?.aboutMyself;
      const educationHistory = generalInfo?.educationHistory;
      const englishLevel = generalInfo?.englishLevel;
      const github = generalInfo?.githubId;
      const name = generalInfo?.name;
      const location = generalInfo?.location;

      const { selfIntroLink, cvLink, militaryService, employmentHistory } = mockOpportunitiesData;

      const coreInfo = {
        name: name ? name : null,
        location: location ? location : null,
        githubId: github ? github : null,
        englishLevel: englishLevel ? englishLevel : null,
        about: about ? about : null,
        selfIntroLink: selfIntroLink ? selfIntroLink : null,
        cvLink: cvLink ? cvLink : null,
        militaryService: militaryService ? militaryService : null,
      };

      await this.setState({
        isLoading: false,
        coreInfo,
        contacts,
        badges: publicFeedback,
        employmentHistory,
        coursesStats: studentStats,
        educationHistory,
      });
    } catch (e) {
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

  private getExistingSections(sections: any) {
    return sections.filter((section: any) => section !== null);
  }

  private formatDate(dateStr: string) {
    if (dateStr === 'currently') return 'Currently working';
    const [month, year] = dateStr.split('-');
    return `${month} / ${year}`;
  }

  private userService = new UserService();

  async componentDidMount() {
    await this.getData();
  }

  render() {
    const { coreInfo, contacts, educationHistory, employmentHistory } = this.state;

    const allowedContacts = ['email', 'phone', 'location', 'website', 'github', 'linkedin', 'twitter'];

    const contactsTransformed = contacts
      ? Object.entries(contacts as object)
          .filter(contact => {
            const [type, value] = contact;
            const isContactAllowed = allowedContacts.includes(type);
            const isContactFilled = value !== null;
            return isContactAllowed && isContactFilled;
          })
          .map(contact => {
            const [type, value] = contact;
            return {
              type,
              value,
            };
          })
      : [];

    const personalData = {
      title: '',
      name: coreInfo?.name,
      image: `https://github.com/${coreInfo?.githubId}.png?size=96`,
      contacts: contactsTransformed,
    };

    const aboutSection = {
      type: 'text',
      title: 'About me',
      content: coreInfo?.about || "There's no info",
      icon: 'usertie',
    };

    const educationSection = educationHistory?.length
      ? {
          type: 'common-list',
          title: 'Education history',
          icon: 'graduation',
          items: educationHistory.map((educationRecord: EducationRecord) => {
            const { university, graduationYear, faculty } = educationRecord;

            return {
              title: `${university}/${faculty}`,
              rightSide: `Graduation in ${graduationYear}`,
            };
          }),
        }
      : null;

    const employmentSection = employmentHistory?.length
      ? {
          type: 'common-list',
          title: 'Employment history',
          icon: 'archive',
          items: employmentHistory.map((employmentRecord: EmploymentRecord) => {
            const { placeOfWork, position, startDate, finishDate } = employmentRecord;

            return {
              title: `${placeOfWork}/${position}`,
              rightSide: `${this.formatDate(startDate as string)} - ${this.formatDate(finishDate as string)}`,
            };
          }),
        }
      : null;

    const sections = [aboutSection, educationSection, employmentSection];

    return (
      <>
        <LoadingScreen show={this.state.isLoading}>
          <Layout style={{ textAlign: 'center' }}>
            <Content>
              <CV personalData={personalData} sections={this.getExistingSections(sections)} branding={false} />
            </Content>
          </Layout>
        </LoadingScreen>
      </>
    );
  }
}

export default withRouter(withSession(CVPage));
