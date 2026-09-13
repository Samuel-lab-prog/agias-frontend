import { expect, test, type Page } from '@playwright/test';
const context = { id: 100, role: 'staff', name: 'Marina Oliveira', email: 'marina@instituicao.example', avatarUrl: null, campusId: 1, campus: { id: 1, institutionId: 1, name: 'Campus Erechim', city: 'Erechim', state: 'RS', address: 'Rua de exemplo, 100', institution: { id: 1, name: 'Instituição de demonstração', acronym: 'DEMO', configured: true } }, staffProfile: { id: 9, department: { name: 'Registros acadêmicos', code: 'RA' } } };
const doc = { id: '56a1cad0-397d-4e68-9bf1-77aaf11f1c28', kind: 'enrollment', createdAt: '2026-09-12T15:00:00Z', verificationCode: 'a'.repeat(48), revokedAt: null, revocationReason: null, snapshot: { title: 'Atestado de matrícula', subjectName: 'Ana Souza', institution: 'Instituição de demonstração', campus: 'Campus Erechim', paragraphs: ['Matrícula ativa.'] } };
async function setup(page: Page, role = 'staff') {
 await page.addInitScript(role => localStorage.setItem('auth-client', JSON.stringify({ authClient: { id: 100, role, status: 'active' }, unreadNotificationsCount: 0 })), role);
 await page.route('**/institution/context', route => route.fulfill({ json: { ...context, role } }));
 await page.route('**/curriculum/academic-periods', route => route.fulfill({ json: [] }));
}
test('staff profile shows readable identity and persistent navigation on desktop and mobile', async ({ page }) => {
 await setup(page);
 await page.goto('/staff/my-profile');
 await expect(page.getByRole('heading', { name: 'Meu perfil', exact: true })).toBeVisible();
 await expect(page.getByRole('heading', { name: 'Marina Oliveira' })).toBeVisible();
 await expect(page.getByText('Registros acadêmicos', { exact: true })).toBeVisible();
 await expect(page.getByText('ID do perfil')).toHaveCount(0);
 await page.screenshot({ path: 'test-results/staff-profile-desktop.png', fullPage: true });
 await page.setViewportSize({ width: 390, height: 844 });
 await page.getByRole('button', { name: 'Abrir navegação' }).click();
 await expect(page.getByRole('link', { name: 'Projetos', exact: true }).filter({ visible: true })).toBeVisible();
 await page.getByRole('button', { name: 'Fechar navegação' }).click();
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
 await page.screenshot({ path: 'test-results/staff-profile-mobile.png', fullPage: true });
});
test('admin can open team details, permissions and campus configuration', async ({ page }) => {
 await setup(page, 'admin');
 const user = { id: 100, name: context.name, email: context.email, nickname: 'marina', role: 'staff', status: 'active', createdAt: '2026-09-01T12:00:00Z', professorProfile: null, staffProfile: { id: 9, departmentId: 1, department: { name: 'Registros acadêmicos' } }, studentProfile: null };
 await page.route('**/admin/users?*', r => r.fulfill({ json: { items: [user], total: 1, page: 1, pageSize: 20 } }));
 await page.route('**/admin/users/100', r => r.fulfill({ json: user }));
 await page.route('**/admin/departments', r => r.fulfill({ json: [{ id: 1, name: 'Registros acadêmicos' }] }));
 await page.route('**/admin/permissions', r => r.request().resourceType() === 'document' ? r.continue() : r.fulfill({ json: [] }));
 await page.goto('/admin/team');
 await expect(page.getByRole('heading', { name: 'Equipe da instituição' })).toBeVisible();
 await page.getByRole('link', { name: 'Gerenciar', exact: true }).click();
 await expect(page.getByLabel('Nome completo')).toHaveValue(context.name);
 await page.goto('/admin/permissions');
 await expect(page.getByRole('heading', { name: 'Papéis e permissões' })).toBeVisible();
 await page.goto('/admin/institution');
 await expect(page.getByLabel('Nome do campus')).toHaveValue(context.campus.name);
 await page.goto('/staff/my-profile');
 await expect(page.getByRole('link', { name: 'Equipe', exact: true }).filter({ visible: true })).toBeVisible();
});
test('professor creates proposal and adds a participant with work plan', async ({ page }) => {
 await setup(page, 'professor');
 let project = { id: 7, title: 'Projeto de pesquisa', objectives: 'Objetivos do projeto de pesquisa.', kind: 'research', startsAt: '2026-08-01T03:00:00Z', endsAt: '2026-09-02T02:59:59Z', status: 'draft', coordinatorId: 100, coordinator: { id: 100, name: context.name }, version: 1, _count: { participants: 0, reports: 0 }, participants: [] as unknown[], reports: [], events: [] };
 await page.route('**/projects/**', async r => {
  if (r.request().resourceType() === 'document') return r.continue();
  const path = new URL(r.request().url()).pathname.split('/projects')[1], method = r.request().method();
  if (path === '/candidates') return r.fulfill({ json: [{ id: 8, name: 'Ana Souza', role: 'student' }] });
  if (path === '/' && method === 'POST') { project = { ...project, ...r.request().postDataJSON() }; return r.fulfill({ json: project, status: 201 }); }
  if (path === '/7/participants') { project.participants.push({ id: 1, ...r.request().postDataJSON(), approvedHours: null, user: { id: 8, name: 'Ana Souza' } }); return r.fulfill({ json: { id: 1 } }); }
  return r.fulfill({ json: project });
 });
 await page.goto('/projects/new');
 await page.getByLabel('Título').fill('Robótica na comunidade');
 await page.getByLabel('Objetivos').fill('Desenvolver oficinas de robótica para a comunidade.');
 await page.getByLabel('Início').fill('2026-08-01');
 await page.getByLabel('Término').fill('2026-09-01');
 await page.getByRole('button', { name: 'Salvar projeto' }).click();
 await expect(page.getByRole('heading', { name: 'Robótica na comunidade' })).toBeVisible();
 await page.getByLabel('Buscar pessoa pelo nome').fill('Ana');
 await page.getByLabel(/^Pessoa/).selectOption('8');
 await page.getByLabel('Função no projeto').fill('Bolsista');
 await page.getByLabel('Plano de trabalho').fill('Preparar atividades e conduzir oficinas de robótica.');
 await page.getByRole('button', { name: 'Adicionar participante', exact: true }).click();
 await expect(page.getByRole('heading', { name: 'Ana Souza' })).toBeVisible();
 await expect(page.getByText('Carga horária aguardando validação')).toBeVisible();
 await page.screenshot({ path: 'test-results/project-desktop.png', fullPage: true });
});
test('student emits a document and verification works without login', async ({ page }) => {
 await setup(page, 'student');
 let issued = false;
 await page.route('**/documents/', r => { if (r.request().method() === 'POST') { issued = true; return r.fulfill({ json: doc, status: 201 }); } return r.fulfill({ json: issued ? [doc] : [] }); });
 await page.route('**/documents/participations', r => r.fulfill({ json: [] }));
 await page.route('**/documents/verify/*', r => r.fulfill({ json: { id: doc.id, title: doc.snapshot.title, subjectName: 'Ana Souza', institution: doc.snapshot.institution, campus: doc.snapshot.campus, issuedAt: doc.createdAt, revokedAt: null, templateVersion: 1 } }));
 await page.goto('/documents');
 await page.getByRole('button', { name: 'Emitir documento', exact: true }).click();
 await expect(page.getByRole('heading', { name: 'Documento emitido' })).toBeVisible();
 await expect(page.getByRole('link', { name: 'Baixar PDF' }).first()).toHaveAttribute('href', new RegExp(doc.id + '/pdf$'));
 await page.evaluate(() => localStorage.removeItem('auth-client'));
 await page.goto('/documents/verify?code=' + doc.verificationCode);
 await page.getByRole('button', { name: 'Consultar autenticidade' }).click();
 await expect(page.getByRole('heading', { name: 'Registro válido no AGIAS' })).toBeVisible();
 await expect(page.getByText('Ana Souza', { exact: true })).toBeVisible();
 await page.screenshot({ path: 'test-results/document-verification.png', fullPage: true });
});
