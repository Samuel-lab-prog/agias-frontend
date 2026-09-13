import { Toaster } from '@BaseComponents';
import { Flex, Spinner } from '@chakra-ui/react';
import { RoleGate } from '@features/auth/public/components/RoleGate';
import { ErrorPage } from '@features/system/public';
import { type ComponentType, lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

function lazyPage<TModule extends object>(
	load: () => Promise<TModule>,
	select: (module: TModule) => ComponentType,
) {
	return lazy(async () => ({ default: select(await load()) }));
}

function PageLoader() {
	return (
		<Flex
			as='main'
			bg='bg.canvas'
			color='fg.default'
			direction='column'
			align='center'
			minH='32vh'
			justify='center'
			_dark={{
				bg: 'bg.canvas',
				color: 'fg.default',
			}}
		>
			<Spinner size='lg' color='fg.muted' />
		</Flex>
	);
}

function renderLazyPage(Component: ComponentType) {
	return (
		<Suspense fallback={<PageLoader />}>
			<Component />
		</Suspense>
	);
}

const LoginPage = lazyPage(
	() => import('./features/auth/use-cases/login/Page'),
	(module) => module.LoginPage,
);
const StudentHomePage = lazyPage(
	() => import('./features/student/use-cases/home/Page'),
	(module) => module.StudentHomePage,
);
const StudentActivitiesPage = lazyPage(
	() => import('./features/student/use-cases/activities/Page'),
	(module) => module.StudentActivitiesPage,
);
const StudentProfilePage = lazyPage(
	() => import('./features/student/use-cases/profile/Page'),
	(module) => module.StudentProfilePage,
);
const StudentAnnouncementsPage = lazyPage(
	() => import('./features/student/use-cases/announcements/Page'),
	(module) => module.StudentAnnouncementsPage,
);
const StudentSchedulePage = lazyPage(
	() => import('./features/student/use-cases/schedule/Page'),
	(module) => module.StudentSchedulePage,
);
const StudentSubjectDetailsPage = lazyPage(
	() => import('./features/student/use-cases/subject-details/Page'),
	(module) => module.StudentSubjectDetailsPage,
);
const StudentSubjectsPage = lazyPage(
	() => import('./features/student/use-cases/subjects/Page'),
	(module) => module.StudentSubjectsPage,
);
const StudentMaterialsPage = lazyPage(
	() => import('./features/student/use-cases/materials/Page'),
	(module) => module.StudentMaterialsPage,
);
const StudentActivityDetailsPage = lazyPage(
	() => import('./features/student/use-cases/activity-details/Page'),
	(module) => module.StudentActivityDetailsPage,
);
const ProfessorHomePage = lazyPage(
	() => import('./features/professor/use-cases/home/Page'),
	(module) => module.ProfessorHomePage,
);
const AdminHomePage = lazyPage(
	() => import('./features/admin/use-cases/home/Page'),
	(module) => module.AdminHomePage,
);
const StaffMyProfilePage = lazyPage(
	() => import('./features/staff/use-cases/my-profile/Page'),
	(module) => module.StaffMyProfilePage,
);
const StaffHomePage = lazyPage(
	() => import('./features/staff/use-cases/home/Page'),
	(module) => module.StaffHomePage,
);
const StaffAcademicCalendarPage = lazyPage(
	() => import('./features/staff/use-cases/academic-calendar/Page'),
	(module) => module.StaffAcademicCalendarPage,
);
const StaffStudentsPage = lazyPage(
	() => import('./features/staff/use-cases/students/Page'),
	(module) => module.StaffStudentsPage,
);
const StaffClassesPage = lazyPage(
	() => import('./features/staff/use-cases/classes/Page'),
	(module) => module.StaffClassesPage,
);
const StaffNewClassPage = lazyPage(
	() => import('./features/staff/use-cases/classes/NewPage'),
	(module) => module.StaffNewClassPage,
);
const StaffClassDetailsPage = lazyPage(
	() => import('./features/staff/use-cases/classes/DetailsPage'),
	(module) => module.StaffClassDetailsPage,
);
const ProjectsPage = lazyPage(
	() => import('./features/services/use-cases/projects/Page'),
	(m) => m.ProjectsPage,
);
const ProjectDetailsPage = lazyPage(
	() => import('./features/services/use-cases/projects/DetailsPage'),
	(m) => m.ProjectDetailsPage,
);
const DocumentsPage = lazyPage(
	() => import('./features/services/use-cases/documents/Page'),
	(m) => m.DocumentsPage,
);
const VerifyDocumentPage = lazyPage(
	() => import('./features/services/use-cases/documents/VerifyPage'),
	(m) => m.VerifyDocumentPage,
);
const InstitutionPage = lazyPage(
	() => import('./features/services/use-cases/institution/Page'),
	(m) => m.InstitutionPage,
);
const DevComponentsPage = lazyPage(
	() => import('./features/dev/use-cases/components-gallery/Page'),
	(module) => module.DevComponentsPage,
);
const DevButtonsPage = lazyPage(
	() => import('./features/dev/use-cases/buttons-gallery/Page'),
	(module) => module.DevButtonsPage,
);
const DevColorsPage = lazyPage(
	() => import('./features/dev/use-cases/colors-gallery/Page'),
	(module) => module.DevColorsPage,
);
const DevTypographyPage = lazyPage(
	() => import('./features/dev/use-cases/typography-gallery/Page'),
	(module) => module.DevTypographyPage,
);
const DevAnimationsPage = lazyPage(
	() => import('./features/dev/use-cases/animations-gallery/Page'),
	(module) => module.DevAnimationsPage,
);

const router = createBrowserRouter([
	...[
		'/admin/team',
		'/admin/team/new',
		'/admin/users',
		'/admin/users/:userId',
		'/admin/permissions',
		'/admin/pending-classes',
	].map((path) => ({
		path,
		element: <RoleGate allowedRoles={['admin']}>{renderLazyPage(AdminHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	})),
	{
		path: '/admin/institution',
		element: <RoleGate allowedRoles={['admin']}>{renderLazyPage(InstitutionPage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/projects',
		element: (
			<RoleGate allowedRoles={['admin', 'staff', 'professor', 'student']}>
				{renderLazyPage(ProjectsPage)}
			</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/projects/new',
		element: (
			<RoleGate allowedRoles={['admin', 'staff', 'professor']}>
				{renderLazyPage(ProjectsPage)}
			</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/projects/:id',
		element: (
			<RoleGate allowedRoles={['admin', 'staff', 'professor', 'student']}>
				{renderLazyPage(ProjectDetailsPage)}
			</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/documents/verify',
		element: renderLazyPage(VerifyDocumentPage),
		errorElement: <ErrorPage />,
	},
	{
		path: '/documents',
		element: (
			<RoleGate allowedRoles={['admin', 'staff', 'professor', 'student']}>
				{renderLazyPage(DocumentsPage)}
			</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/',
		element: <Navigate to='/login' replace />,
		errorElement: <ErrorPage />,
	},
	{
		path: '/student',
		element: <RoleGate allowedRoles={['student']}>{renderLazyPage(StudentHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/student/activities',
		element: (
			<RoleGate allowedRoles={['student']}>{renderLazyPage(StudentActivitiesPage)}</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/student/profile',
		element: <RoleGate allowedRoles={['student']}>{renderLazyPage(StudentProfilePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/student/announcements',
		element: (
			<RoleGate allowedRoles={['student']}>{renderLazyPage(StudentAnnouncementsPage)}</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/student/schedule',
		element: <RoleGate allowedRoles={['student']}>{renderLazyPage(StudentSchedulePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/student/subjects',
		element: <RoleGate allowedRoles={['student']}>{renderLazyPage(StudentSubjectsPage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/student/classes',
		element: <RoleGate allowedRoles={['student']}>{renderLazyPage(StudentSubjectsPage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/student/materials',
		element: <RoleGate allowedRoles={['student']}>{renderLazyPage(StudentMaterialsPage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	...['', '/plan', '/activities', '/assessments'].map((section) => ({
		path: `/student/classes/:classOfferingId${section}`,
		element: (
			<RoleGate allowedRoles={['student']}>{renderLazyPage(StudentSubjectDetailsPage)}</RoleGate>
		),
		errorElement: <ErrorPage />,
	})),
	{
		path: '/student/subjects/:enrollmentId',
		element: (
			<RoleGate allowedRoles={['student']}>{renderLazyPage(StudentSubjectDetailsPage)}</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/student/subjects/:enrollmentId/activities/:activityId',
		element: (
			<RoleGate allowedRoles={['student']}>{renderLazyPage(StudentActivityDetailsPage)}</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/professor',
		element: <RoleGate allowedRoles={['professor']}>{renderLazyPage(ProfessorHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/professor/classes',
		element: <RoleGate allowedRoles={['professor']}>{renderLazyPage(ProfessorHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/professor/classes/:classId',
		element: <RoleGate allowedRoles={['professor']}>{renderLazyPage(ProfessorHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/professor/activities',
		element: <RoleGate allowedRoles={['professor']}>{renderLazyPage(ProfessorHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/professor/calendar',
		element: <RoleGate allowedRoles={['professor']}>{renderLazyPage(ProfessorHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/professor/materials',
		element: <RoleGate allowedRoles={['professor']}>{renderLazyPage(ProfessorHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/professor/profile',
		element: <RoleGate allowedRoles={['professor']}>{renderLazyPage(ProfessorHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/admin',
		element: <RoleGate allowedRoles={['admin']}>{renderLazyPage(AdminHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/login',
		element: renderLazyPage(LoginPage),
		errorElement: <ErrorPage />,
	},
	{
		path: '/staff/my-profile',
		element: (
			<RoleGate allowedRoles={['staff', 'admin']}>{renderLazyPage(StaffMyProfilePage)}</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/staff/academic-calendar',
		element: (
			<RoleGate allowedRoles={['staff', 'admin']}>
				{renderLazyPage(StaffAcademicCalendarPage)}
			</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/staff/students',
		element: (
			<RoleGate allowedRoles={['staff', 'admin']}>{renderLazyPage(StaffStudentsPage)}</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/staff/classes',
		element: (
			<RoleGate allowedRoles={['staff', 'admin']}>{renderLazyPage(StaffClassesPage)}</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/staff/classes/new',
		element: (
			<RoleGate allowedRoles={['staff', 'admin']}>{renderLazyPage(StaffNewClassPage)}</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/staff/classes/:classId',
		element: (
			<RoleGate allowedRoles={['staff', 'admin']}>{renderLazyPage(StaffClassDetailsPage)}</RoleGate>
		),
		errorElement: <ErrorPage />,
	},
	{
		path: '/staff',
		element: <RoleGate allowedRoles={['staff', 'admin']}>{renderLazyPage(StaffHomePage)}</RoleGate>,
		errorElement: <ErrorPage />,
	},
	{
		path: '/dev/components',
		element: <Navigate to='/dev/components/buttons' replace />,
		errorElement: <ErrorPage />,
	},
	{
		path: '/dev/components/buttons',
		element: renderLazyPage(DevButtonsPage),
		errorElement: <ErrorPage />,
	},
	{
		path: '/dev/components/forms',
		element: renderLazyPage(DevComponentsPage),
		errorElement: <ErrorPage />,
	},
	{
		path: '/dev/components/colors',
		element: renderLazyPage(DevColorsPage),
		errorElement: <ErrorPage />,
	},
	{
		path: '/dev/components/typography',
		element: renderLazyPage(DevTypographyPage),
		errorElement: <ErrorPage />,
	},
	{
		path: '/dev/components/animations',
		element: renderLazyPage(DevAnimationsPage),
		errorElement: <ErrorPage />,
	},
]);

export default function App() {
	return (
		<>
			<RouterProvider router={router} />
			<Toaster />
		</>
	);
}
