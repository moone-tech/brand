// =============================================================================
// client/src/lib/i18n.tsx — CZ/EN internationalisation
// =============================================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type Lang = 'cs' | 'en';

// ---------------------------------------------------------------------------
// Dictionaries
// ---------------------------------------------------------------------------

const cs = {
  // Nav
  nav_overview: 'Přehled',
  nav_guidelines: 'Brand Guidelines',
  nav_assets: 'Assety',
  nav_team: 'Tým →',
  nav_admin: 'Přehled',
  nav_ci: 'CI Editor',
  nav_moodboard: 'Mood Board',
  nav_projects: 'Projekty',
  nav_users: 'Uživatelé',

  // Auth
  login_title: 'Přihlášení',
  login_subtitle: 'Přihlaste se do Brand portálu',
  login_email: 'E-mail',
  login_password: 'Heslo',
  login_submit: 'Přihlásit se',
  login_forgot: 'Zapomenuté heslo?',
  login_loading: 'Přihlašuji…',
  forgot_title: 'Zapomenuté heslo',
  forgot_subtitle: 'Zadejte e-mail a pošleme vám odkaz pro reset hesla.',
  forgot_submit: 'Odeslat odkaz',
  forgot_back: 'Zpět na přihlášení',
  reset_title: 'Nové heslo',
  reset_submit: 'Uložit heslo',
  accept_title: 'Přijmout pozvánku',
  accept_submit: 'Aktivovat účet',

  // Dashboard
  dashboard_title: 'Přehled',
  dashboard_subtitle: 'Brand workspace',
  dashboard_welcome: 'Vítejte v administraci',
  dashboard_ci: 'CI Editor',
  dashboard_ci_desc: 'Správa firemního designu a tokenů',
  dashboard_moodboard: 'Mood Board',
  dashboard_moodboard_desc: 'Vizuální inspirace a reference',
  dashboard_projects: 'Projekty',
  dashboard_projects_desc: 'Kanban board pro CI úkoly',
  dashboard_users: 'Uživatelé',
  dashboard_users_desc: 'Správa přístupu do portálu',

  // Moodboard
  moodboard_title: 'Mood Board',
  moodboard_subtitle: 'Vizuální reference a inspirace pro CI',
  moodboard_new_board: 'Nový board…',
  moodboard_add_item: 'Přidat položku',
  moodboard_new_item: 'Nová položka',
  moodboard_type_image: 'Obrázek (URL)',
  moodboard_type_image_upload: 'Obrázek (nahrát)',
  moodboard_type_url: 'Odkaz',
  moodboard_type_color: 'Barva (hex)',
  moodboard_type_note: 'Poznámka',
  moodboard_title_placeholder: 'Název (volitelný)',
  moodboard_value_placeholder_url: 'URL…',
  moodboard_value_placeholder_color: '#3b82f6',
  moodboard_value_placeholder_note: 'Text poznámky…',
  moodboard_add: 'Přidat',
  moodboard_cancel: 'Zrušit',
  moodboard_empty: 'Board je prázdný. Přidej první položku.',
  moodboard_note_edit: 'Upravit poznámku',
  moodboard_note_save: 'Uložit',
  moodboard_upload_click: 'Klikni pro nahrání',
  moodboard_uploading: 'Nahrávám…',

  // Projects
  projects_title: 'Projekty',
  projects_subtitle: 'Kanban board pro CI úkoly',
  projects_new: 'Nový projekt…',
  projects_empty: 'Vytvoř první projekt výše.',
  projects_add_task: 'Přidat úkol',
  projects_task_title: 'Název úkolu…',
  projects_add_btn: 'Přidat',
  projects_cancel: 'Zrušit',
  projects_col_todo: 'To Do',
  projects_col_in_progress: 'In Progress',
  projects_col_review: 'Review',
  projects_col_done: 'Hotovo',
  projects_rename: 'Přejmenovat projekt',
  projects_owner: 'Vlastník',
  projects_team: 'Tým',
  projects_assignee: 'Přiřadit',
  projects_no_owner: 'Bez vlastníka',
  projects_no_assignee: 'Nepřiřazeno',
  projects_col_rename: 'Přejmenovat sloupec',
  projects_settings: 'Nastavení projektu',
  projects_save: 'Uložit',
  projects_delete: 'Smazat projekt',
  projects_priority_low: 'nízká',
  projects_priority_medium: 'střední',
  projects_priority_high: 'vysoká',

  // Users
  users_title: 'Uživatelé',
  users_subtitle: 'Správa přístupu do Brand portálu',
  users_invite: 'Pozvat uživatele',
  users_email: 'E-mail',
  users_role: 'Role',
  users_invited_by: 'Pozval',
  users_status: 'Stav',
  users_actions: 'Akce',
  users_invite_btn: 'Pozvat',
  users_resend: 'Znovu odeslat',
  users_revoke: 'Odvolat',

  // Common
  cancel: 'Zrušit',
  save: 'Uložit',
  delete: 'Smazat',
  confirm: 'Potvrdit',
  loading: 'Načítám…',
  error: 'Chyba',
  success: 'Úspěch',
  name: 'Název',
  description: 'Popis',
  color: 'Barva',
  edit: 'Upravit',
  add: 'Přidat',

  // Public pages
  home_title: 'Mo.one Brand Portal',
  home_subtitle: 'Firemní identita a brand guidelines',
  guidelines_title: 'Brand Guidelines',
  assets_title: 'Assety ke stažení',

  // Logout
  logout: 'Odhlásit se',

  // Theme
  theme_dark: 'Tmavý režim',
  theme_light: 'Světlý režim',
  lang_cs: 'CZ',
  lang_en: 'EN',
} as const;

const en: { [K in keyof typeof cs]: string } = {
  nav_overview: 'Overview',
  nav_guidelines: 'Brand Guidelines',
  nav_assets: 'Assets',
  nav_team: 'Team →',
  nav_admin: 'Overview',
  nav_ci: 'CI Editor',
  nav_moodboard: 'Mood Board',
  nav_projects: 'Projects',
  nav_users: 'Users',

  login_title: 'Sign In',
  login_subtitle: 'Sign in to the Brand portal',
  login_email: 'Email',
  login_password: 'Password',
  login_submit: 'Sign In',
  login_forgot: 'Forgot password?',
  login_loading: 'Signing in…',
  forgot_title: 'Forgot Password',
  forgot_subtitle: 'Enter your email and we\'ll send you a reset link.',
  forgot_submit: 'Send Link',
  forgot_back: 'Back to Sign In',
  reset_title: 'New Password',
  reset_submit: 'Save Password',
  accept_title: 'Accept Invitation',
  accept_submit: 'Activate Account',

  dashboard_title: 'Overview',
  dashboard_subtitle: 'Brand workspace',
  dashboard_welcome: 'Welcome to admin',
  dashboard_ci: 'CI Editor',
  dashboard_ci_desc: 'Manage corporate design and tokens',
  dashboard_moodboard: 'Mood Board',
  dashboard_moodboard_desc: 'Visual inspiration and references',
  dashboard_projects: 'Projects',
  dashboard_projects_desc: 'Kanban board for CI tasks',
  dashboard_users: 'Users',
  dashboard_users_desc: 'Manage portal access',

  moodboard_title: 'Mood Board',
  moodboard_subtitle: 'Visual references and inspiration for CI',
  moodboard_new_board: 'New board…',
  moodboard_add_item: 'Add Item',
  moodboard_new_item: 'New Item',
  moodboard_type_image: 'Image (URL)',
  moodboard_type_image_upload: 'Image (upload)',
  moodboard_type_url: 'Link',
  moodboard_type_color: 'Color (hex)',
  moodboard_type_note: 'Note',
  moodboard_title_placeholder: 'Title (optional)',
  moodboard_value_placeholder_url: 'URL…',
  moodboard_value_placeholder_color: '#3b82f6',
  moodboard_value_placeholder_note: 'Note text…',
  moodboard_add: 'Add',
  moodboard_cancel: 'Cancel',
  moodboard_empty: 'Board is empty. Add your first item.',
  moodboard_note_edit: 'Edit note',
  moodboard_note_save: 'Save',
  moodboard_upload_click: 'Click to upload',
  moodboard_uploading: 'Uploading…',

  projects_title: 'Projects',
  projects_subtitle: 'Kanban board for CI tasks',
  projects_new: 'New project…',
  projects_empty: 'Create your first project above.',
  projects_add_task: 'Add task',
  projects_task_title: 'Task title…',
  projects_add_btn: 'Add',
  projects_cancel: 'Cancel',
  projects_col_todo: 'To Do',
  projects_col_in_progress: 'In Progress',
  projects_col_review: 'Review',
  projects_col_done: 'Done',
  projects_rename: 'Rename project',
  projects_owner: 'Owner',
  projects_team: 'Team',
  projects_assignee: 'Assign',
  projects_no_owner: 'No owner',
  projects_no_assignee: 'Unassigned',
  projects_col_rename: 'Rename column',
  projects_settings: 'Project settings',
  projects_save: 'Save',
  projects_delete: 'Delete project',
  projects_priority_low: 'low',
  projects_priority_medium: 'medium',
  projects_priority_high: 'high',

  users_title: 'Users',
  users_subtitle: 'Manage Brand portal access',
  users_invite: 'Invite User',
  users_email: 'Email',
  users_role: 'Role',
  users_invited_by: 'Invited by',
  users_status: 'Status',
  users_actions: 'Actions',
  users_invite_btn: 'Invite',
  users_resend: 'Resend',
  users_revoke: 'Revoke',

  cancel: 'Cancel',
  save: 'Save',
  delete: 'Delete',
  confirm: 'Confirm',
  loading: 'Loading…',
  error: 'Error',
  success: 'Success',
  name: 'Name',
  description: 'Description',
  color: 'Color',
  edit: 'Edit',
  add: 'Add',

  home_title: 'Mo.one Brand Portal',
  home_subtitle: 'Corporate identity and brand guidelines',
  guidelines_title: 'Brand Guidelines',
  assets_title: 'Assets Download',

  logout: 'Sign Out',

  theme_dark: 'Dark mode',
  theme_light: 'Light mode',
  lang_cs: 'CZ',
  lang_en: 'EN',
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type TranslationKey = keyof typeof cs;
type Dict = { [K in TranslationKey]: string };

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

const DICTIONARIES: Record<Lang, Dict> = { cs: cs as Dict, en };

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('brand-lang') as Lang) ?? 'cs';
  });

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem('brand-lang', l);
    setLangState(l);
  }, []);

  const t = useCallback((key: TranslationKey) => DICTIONARIES[lang][key] ?? key, [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useTranslation must be used within LangProvider');
  return ctx;
}
