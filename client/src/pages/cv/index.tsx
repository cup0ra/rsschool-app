import * as React from 'react';
import { Layout } from 'antd';
import { NextRouter, withRouter } from 'next/router';
import withSession, { Session } from 'components/withSession';
import { LoadingScreen } from 'components/LoadingScreen';
import { UserService } from 'services/user';
import {
  ContactsCV,
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
  contacts: ContactsCV | null;
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
      const profileContacts = profile?.contacts ?? null;
      const studentStats = profile?.studentStats ?? null;
      const publicFeedback = profile?.publicFeedback ?? null;

      const about = generalInfo?.aboutMyself ?? null;
      const educationHistory = generalInfo?.educationHistory ?? null;
      const englishLevel = generalInfo?.englishLevel ?? null;
      const github = generalInfo?.githubId ?? null;
      const name = generalInfo?.name ?? null;
      const location = generalInfo?.location ?? null;

      const selfIntroLink = mockOpportunitiesData?.selfIntroLink ?? null;
      const cvLink = mockOpportunitiesData?.cvLink ?? null;
      const militaryService = mockOpportunitiesData?.militaryService ?? null;
      const employmentHistory = mockOpportunitiesData?.employmentHistory ?? null;

      const coreInfo = {
        name,
        location,
        githubId: github,
        englishLevel,
        about,
        selfIntroLink,
        cvLink,
        militaryService,
      };

      const locationForPersonalData = location ? `${location?.countryName}/ ${location?.cityName}` : null;

      const contactsCV = {
        skype: profileContacts?.skype ?? null,
        phone: profileContacts?.phone ?? null,
        email: profileContacts?.email ?? null,
        telegram: profileContacts?.telegram ?? null,
        notes: profileContacts?.notes ?? null,
        linkedin: profileContacts?.linkedIn ?? null,
        location: locationForPersonalData,
        github,
        website: [cvLink, selfIntroLink],
      };

      await this.setState({
        isLoading: false,
        coreInfo,
        contacts: contactsCV,
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

  private getCoursesGeneralInfo(courses: CoursesStats[]) {
    const coursesTransformed = courses.map(course => {
      const {
        certificateId,
        courseFullName,
        isExpelled,
        locationName,
        position,
        isCourseCompleted,
        totalScore,
      } = course;
      const title = `${courseFullName}${locationName ? locationName : ''}`;
      const authorityWebsite = certificateId ? `https://app.rs.school/certificate/${certificateId}` : null;
      const authority = certificateId ? 'Certificate' : isCourseCompleted ? 'No certificate' : null;
      const rightSide = `Score: ${totalScore}/ Position: ${position}`;
      let authorityMeta;
      if (isExpelled) {
        authorityMeta = 'Expelled';
      } else if (certificateId) {
        authorityMeta = 'Completed with certificate';
      } else if (isCourseCompleted) {
        authorityMeta = 'Completed';
      } else {
        authorityMeta = 'In progress';
      }
      return {
        title,
        authority,
        authorityWebsite,
        authorityMeta,
        rightSide,
      };
    });
    return coursesTransformed;
  }

  private getContactsData(contacts: any) {
    const allowedContacts = ['email', 'phone', 'location', 'website', 'github', 'linkedin', 'twitter'];

    const contactsData: any = [];

    const transformedContacts = Object.entries(contacts as object).filter(contact => {
      const [type, value] = contact;
      const isContactAllowed = allowedContacts.includes(type);
      const isContactFilled = value !== null && value !== '';
      return isContactAllowed && isContactFilled;
    });

    transformedContacts.forEach((contact: any) => {
      const [type, value] = contact;
      if (typeof value === 'string') {
        contactsData.push({
          type,
          value,
        });
      } else {
        value.forEach((item: any) => {
          contactsData.push({
            type,
            value: item,
          });
        });
      }
    });

    return contactsData;
  }

  private getBadgesGeneralInfo(badges: PublicFeedback[]) {
    const uniqueBadgesSummarized = badges.reduce((uniqueBadges, badge) => {
      const { badgeId } = badge;
      if (uniqueBadges[badgeId]) {
        uniqueBadges[badgeId]++;
      } else {
        uniqueBadges[badgeId] = 1;
      }
      return uniqueBadges;
    }, {} as any);

    const badgesFormatted = Object.entries(uniqueBadgesSummarized).map(entry => {
      const [badgeId, badgeCount] = entry;
      return `${badgeId}: ${badgeCount}`;
    });

    return badgesFormatted;
  }

  private userService = new UserService();

  async componentDidMount() {
    await this.getData();
  }

  render() {
    const { coreInfo, contacts, educationHistory, employmentHistory, badges, coursesStats } = this.state;

    const contactsTransformed = contacts ? this.getContactsData(contacts) : [];

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

    const badgesSection = badges?.length
      ? {
          type: 'tag-list',
          title: 'Public feedback',
          icon: 'comments',
          items: this.getBadgesGeneralInfo(badges),
        }
      : null;

    const coursesSection = coursesStats?.length
      ? {
          type: 'common-list',
          title: 'RSSchool courses',
          icon: 'tasks',
          items: this.getCoursesGeneralInfo(coursesStats),
        }
      : null;

    const sections = [aboutSection, educationSection, employmentSection, coursesSection, badgesSection];

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
